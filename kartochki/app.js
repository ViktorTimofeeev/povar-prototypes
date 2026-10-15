/* Данные — в data.js. Здесь только отрисовка и поведение. */
const IMG = id => `https://5a215d9f-941d-44e4-9fa0-e984eab55468.selstorage.ru/${id}/${id}-wc400.webp`;
const DISH = {};
for (const [n, img, kg, cnt, u, pp, price, rc, h] of RAW) DISH[n] = { n, img, kg, cnt, u, pp, price, rc, h };
const kind = d => d.h <= 2 ? 'fast' : d.h > DEFAULT_H ? 'slow' : 'mid';
const CATS = [
  { name: 'Повар рекомендует', tab: 'Рекомендует', icon: 'logo', dishes: CAT_NAMES['Повар рекомендует'] },
  { name: 'Быстро', tab: 'Быстро', icon: 'fast', dishes: RAW.map(r => r[0]).filter(n => kind(DISH[n]) === 'fast') },
  ...Object.keys(CAT_NAMES).filter(k => k !== 'Повар рекомендует').map(k => ({ name: k, tab: k, dishes: CAT_NAMES[k] })),
];

/* ---------- тексты ---------- */
const plural = (n, a, b, c) => n % 10 === 1 && n % 100 !== 11 ? a : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? b : c;
const money = n => n.toLocaleString('ru-RU').replace(/ /g, ' ') + ' ₽';
const unitMany = d => d.u === 'ш' ? plural(d.cnt, 'штука', 'штуки', 'штук') : plural(d.cnt, 'порция', 'порции', 'порций');
const weight = d => `${d.kg} кг ≈ ${d.cnt} ${unitMany(d)}`;
const perPrice = d => `${d.pp} ₽ за ${d.u === 'ш' ? 'штуку' : 'порцию'}`;
/* Время (15.10, макет 5054:67717): до 2 часов — минутами и серым время «120 минут · с 14:00»;
   больше 2 часов сегодня — «С 15:00»; не сегодня — «Завтра с 12:00» красным. */
const isTomorrow = d => NOW + d.h >= 21;
const durText = d => d.h <= 2 ? `${d.h * 60} минут` : `${d.h} ${plural(d.h, 'час', 'часа', 'часов')}`;
function timeHTML(d) {
  if (isTomorrow(d)) return 'Завтра с 12:00';
  if (d.h <= 2) return `${durText(d)}<span class="t-mute"> · с ${NOW + d.h}:00</span>`;
  return `С ${NOW + d.h}:00`;
}
const tone = d => isTomorrow(d) ? 'late' : kind(d) === 'fast' ? 'fast' : 'mid';
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

/* ---------- иконки (из Figma) ---------- */
const I = {
  fast: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M5.98789 14.0282L6.78789 9.66674H3.83789L8.73139 2.00391H9.41856L8.82506 7.13341H12.0916L6.67506 14.0282H5.98789Z" fill="#1DAA47"/></svg>',
  clock: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.2" stroke="currentColor" stroke-width="1.3"/><path d="M8 4.6V8l2.3 1.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  star16: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M7.69764 1.32291C7.81678 1.06462 8.18387 1.06462 8.30301 1.32291L9.99118 4.98285C10.0397 5.08812 10.1395 5.1606 10.2546 5.17425L14.2571 5.64881C14.5396 5.6823 14.653 6.03143 14.4442 6.22455L11.485 8.96108C11.3999 9.03979 11.3618 9.15706 11.3844 9.27077L12.1699 13.224C12.2253 13.503 11.9284 13.7188 11.6802 13.5798L8.16314 11.6112C8.06198 11.5545 7.93867 11.5545 7.83751 11.6112L4.3205 13.5798C4.07229 13.7188 3.77531 13.503 3.83074 13.224L4.61624 9.27077C4.63884 9.15706 4.60073 9.03979 4.51562 8.96108L1.55648 6.22455C1.34765 6.03143 1.46109 5.6823 1.74355 5.64881L5.74603 5.17425C5.86115 5.1606 5.96092 5.08812 6.00947 4.98285L7.69764 1.32291Z" fill="#F7C153"/></svg>',
  star12: '<svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M7.69764 1.32291C7.81678 1.06462 8.18387 1.06462 8.30301 1.32291L9.99118 4.98285C10.0397 5.08812 10.1395 5.1606 10.2546 5.17425L14.2571 5.64881C14.5396 5.6823 14.653 6.03143 14.4442 6.22455L11.485 8.96108C11.3999 9.03979 11.3618 9.15706 11.3844 9.27077L12.1699 13.224C12.2253 13.503 11.9284 13.7188 11.6802 13.5798L8.16314 11.6112C8.06198 11.5545 7.93867 11.5545 7.83751 11.6112L4.3205 13.5798C4.07229 13.7188 3.77531 13.503 3.83074 13.224L4.61624 9.27077C4.63884 9.15706 4.60073 9.03979 4.51562 8.96108L1.55648 6.22455C1.34765 6.03143 1.46109 5.6823 1.74355 5.64881L5.74603 5.17425C5.86115 5.1606 5.96092 5.08812 6.00947 4.98285L7.69764 1.32291Z" fill="#F7C153"/></svg>',
  plus: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M11.25 20.5V12.75H3.5V11.25H11.25V3.5H12.75V11.25H20.5V12.75H12.75V20.5H11.25Z" fill="#1C201D"/></svg>',
  minus: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3.5 12.75V11.25H20.5V12.75H3.5Z" fill="#1C201D"/></svg>',
  filter: '<svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="#1DAA47" d="M10.2 17.4h3.6v-1.8h-3.6zM3.9 6.6v1.8h16.2V6.6zm2.7 6.3h10.8v-1.8H6.6z"/></svg>',
  fastFill: '<svg width="24" height="24" viewBox="0 0 16 16" fill="none"><path d="M5.98789 14.0282L6.78789 9.66674H3.83789L8.73139 2.00391H9.41856L8.82506 7.13341H12.0916L6.67506 14.0282H5.98789Z" fill="#1DAA47"/></svg>',
  heart16: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 13.6 2.9 8.5A3.3 3.3 0 0 1 7.6 3.8l.4.45.4-.45a3.3 3.3 0 0 1 4.7 4.7L8 13.6Z" stroke="#1C201D" stroke-width="1.3" stroke-linejoin="round"/></svg>',
  heart: '<svg width="12" height="10" viewBox="13 10 12 10" fill="none"><path d="M19.0003 19.2353L14.4827 14.7177C14.0801 14.1654 13.9135 13.4758 14.0194 12.8007C14.1253 12.1256 14.4951 11.5202 15.0474 11.1177C15.5996 10.7152 16.2892 10.5485 16.9643 10.6544C17.6394 10.7603 18.2449 11.1301 18.6474 11.6824L19.0003 12.1059L19.3532 11.6824C19.7557 11.1301 20.3612 10.7603 21.0363 10.6544C21.7114 10.5485 22.401 10.7152 22.9532 11.1177C23.5055 11.5202 23.8753 12.1256 23.9812 12.8007C24.0871 13.4758 23.9205 14.1654 23.5179 14.7177L19.0003 19.2353Z" stroke="#1C201D" stroke-width="1.13" stroke-linejoin="round"/></svg>',
  logo: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M5.86149 13.7215C5.86152 14.0635 6.21786 14.0374 6.35119 13.923L8.08586 12.1684C8.18493 12.0681 8.31714 12.0091 8.45641 12.0021L8.48434 12.0014H11.0799L11.1048 12.0007C11.3521 11.9887 11.5559 11.7987 11.5881 11.5502L11.5907 11.5261L11.8067 8.92839C11.8118 8.86787 11.8541 8.81726 11.9123 8.80222L12.1206 8.74833C13.1677 8.47781 13.9501 7.53774 13.9977 6.40614L14 6.29682C14 4.92139 12.9154 3.80226 11.5647 3.76761L11.5003 3.76677C11.3606 3.76677 11.2233 3.77856 11.0896 3.80089L10.8786 3.83612C10.8197 3.84595 10.761 3.81711 10.7322 3.76413L10.6293 3.5746C10.1345 2.66443 9.19342 2.04008 8.10567 2.00195L8 2C6.86764 2 5.88116 2.63506 5.37041 3.5746L5.26749 3.76413C5.23295 3.81676 5.18333 3.84124 5.12108 3.83612L4.91015 3.80089C4.77433 3.77822 4.63749 3.76824 4.49998 3.76677C3.1194 3.76677 2.00002 4.89956 2 6.29682L2.00069 6.35211C2.02517 7.50768 2.81557 8.47346 3.87928 8.74833L4.0876 8.80222C4.14575 8.81725 4.1881 8.86787 4.19314 8.92839L4.4093 11.5261C4.43099 11.7863 4.64007 11.9885 4.89529 12.0009L5.57969 12.0014C5.73531 12.0014 5.86149 12.1291 5.86149 12.2866V13.7215Z" fill="#1DAA47"/></svg>',
  search: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M17.4279 16.1553L21.2826 20.0091L20.0091 21.2826L16.1553 17.4279C14.7214 18.5774 12.9378 19.2026 11.1 19.2C6.6288 19.2 3 15.5712 3 11.1C3 6.6288 6.6288 3 11.1 3C15.5712 3 19.2 6.6288 19.2 11.1C19.2026 12.9378 18.5774 14.7214 17.4279 16.1553ZM15.6225 15.4875C16.7647 14.3129 17.4026 12.7384 17.4 11.1C17.4 7.6188 14.5803 4.8 11.1 4.8C7.6188 4.8 4.8 7.6188 4.8 11.1C4.8 14.5803 7.6188 17.4 11.1 17.4C12.7384 17.4026 14.3129 16.7647 15.4875 15.6225L15.6225 15.4875Z" fill="#111111"/></svg>',
  cart: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5.9145 21.047C5.57417 20.7067 5.404 20.2936 5.404 19.8078C5.404 19.3218 5.57417 18.9086 5.9145 18.5683C6.25483 18.2279 6.66792 18.0577 7.15375 18.0577C7.63975 18.0577 8.05292 18.2279 8.39325 18.5683C8.73358 18.9086 8.90375 19.3218 8.90375 19.8078C8.90375 20.2936 8.73358 20.7067 8.39325 21.047C8.05292 21.3875 7.63975 21.5578 7.15375 21.5578C6.66792 21.5578 6.25483 21.3875 5.9145 21.047ZM15.6068 21.047C15.2664 20.7067 15.0963 20.2936 15.0963 19.8078C15.0963 19.3218 15.2664 18.9086 15.6068 18.5683C15.9471 18.2279 16.3603 18.0577 16.8463 18.0577C17.3321 18.0577 17.7452 18.2279 18.0855 18.5683C18.4258 18.9086 18.596 19.3218 18.596 19.8078C18.596 20.2936 18.4258 20.7067 18.0855 21.047C17.7452 21.3875 17.3321 21.5578 16.8463 21.5578C16.3603 21.5578 15.9471 21.3875 15.6068 21.047ZM6.01525 5.75L8.55 11.0577H15.3673C15.4249 11.0577 15.4763 11.0433 15.5213 11.0145C15.5661 10.9857 15.6045 10.9456 15.6365 10.8943L18.3193 6.01925C18.3578 5.94875 18.3609 5.88625 18.3288 5.83175C18.2968 5.77725 18.2423 5.75 18.1653 5.75H6.01525ZM5.29625 4.25H19.1808C19.5898 4.25 19.899 4.42408 20.1085 4.77225C20.3182 5.12025 20.3282 5.47567 20.1385 5.8385L16.9345 11.6423C16.7705 11.9308 16.5536 12.1554 16.2838 12.3162C16.0138 12.4772 15.7179 12.5577 15.3963 12.5577H8.1L6.94225 14.673C6.89092 14.75 6.88933 14.8333 6.9375 14.923C6.9855 15.0128 7.05758 15.0577 7.15375 15.0577H17.846C18.2602 15.0577 18.596 15.3935 18.596 15.8077C18.596 16.222 18.2602 16.5577 17.846 16.5577H7.15375C6.48708 16.5577 5.98617 16.2703 5.651 15.6953C5.31567 15.1203 5.30383 14.5462 5.6155 13.973L7.04225 11.4078L3.404 3.75H2.25C1.83579 3.75 1.5 3.41421 1.5 3C1.5 2.58579 1.83579 2.25 2.25 2.25H3.71417C4.10023 2.25 4.45181 2.47222 4.61745 2.82094L5.29625 4.25Z" fill="white"/></svg>',
  delivery: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M15.5467 5.96594C15.4936 5.87757 15.4053 5.84223 15.3151 5.85988C14.8202 5.87757 14.3077 5.85988 13.8128 5.85988C13.7598 5.85988 13.7245 5.84223 13.7068 5.7892L12.7347 3.77435C12.2734 2.78283 11.4957 2.23494 10.3646 2.25261L5.32218 2.27028C4.70359 2.30563 4.13802 2.58842 3.7492 3.06562L2.29815 5.77151C2.28401 5.8157 2.2575 5.84752 2.21861 5.84752H0.689809C0.601438 5.82454 0.513068 5.85988 0.460037 5.9306C0.407017 6.00128 0.389347 6.09142 0.407017 6.17979C0.477717 6.48024 0.566088 6.78072 0.654458 7.0635C0.707478 7.22257 0.86655 7.32861 1.02561 7.31094H1.6442C1.62653 7.3463 1.62653 7.36395 1.60885 7.38164C1.44979 7.78815 1.3084 8.17697 1.14933 8.58349C1.13166 8.6365 1.11398 8.68951 1.11398 8.74254V12.9525C1.11398 13.0409 1.13166 13.1469 1.167 13.2353C1.22003 13.3944 1.3084 13.5181 1.44979 13.6065C1.57351 13.6948 1.73257 13.7479 1.89165 13.7479H3.27199C3.44873 13.7479 3.62547 13.6948 3.76686 13.5711C3.90826 13.4651 3.99663 13.306 4.03198 13.1293C4.04965 12.9879 4.06733 12.8288 4.06733 12.6874V12.1749H11.9376V12.8465C11.9376 13.4474 12.2557 13.7479 12.8408 13.7479H13.8835C13.9719 13.7479 14.0426 13.7479 14.131 13.7302C14.3077 13.6948 14.4668 13.6065 14.5905 13.4651C14.7142 13.3237 14.7672 13.1469 14.7672 12.9702V8.86625C14.7672 8.72487 14.7496 8.58349 14.7142 8.45976C14.6435 8.23 14.5728 8.00023 14.4844 7.77046C14.4314 7.61141 14.3784 7.47001 14.3254 7.31094H14.944C15.1207 7.32861 15.2798 7.22257 15.3346 7.04583C15.4229 6.76305 15.4936 6.48024 15.582 6.21513C15.6173 6.12676 15.5997 6.03839 15.5467 5.96594ZM3.1306 6.17979L4.4915 3.82736C4.70359 3.4898 5.07475 3.29539 5.46534 3.31306H10.3646C10.5767 3.31306 10.8065 3.34841 11.0009 3.4191C11.1599 3.4898 11.319 3.59761 11.4251 3.72134L13.1059 6.72771L13.1235 6.78072C12.9821 6.72771 12.8231 6.69234 12.6817 6.67468C12.3441 6.63934 11.9906 6.63934 11.6548 6.62164H4.04965C3.64314 6.60397 3.23664 6.65698 2.83014 6.74535C2.93618 6.55096 3.04223 6.37422 3.1306 6.17979ZM5.02703 10.3562H3.05107C2.77712 10.3562 2.53322 10.114 2.53322 9.84186V9.67927C2.53322 9.54495 2.58801 9.40885 2.69581 9.32756C2.80362 9.24627 2.94149 9.19323 3.05107 9.21973L4.37662 9.38234C4.67532 9.40885 5.21614 9.87015 5.32572 10.0328C5.46005 10.2219 5.32572 10.3562 5.02703 10.3562ZM13.47 9.84186C13.47 10.114 13.226 10.3562 12.9521 10.3562H10.9761C10.6774 10.3562 10.5414 10.2219 10.6774 10.0328C10.7853 9.87015 11.3279 9.40885 11.6248 9.38234L12.9521 9.21973C13.0599 9.19323 13.1978 9.24627 13.3073 9.32756C13.4152 9.40885 13.47 9.54495 13.47 9.67927V9.84186Z" fill="#1DAA47"/></svg>',
  back: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M8.245 11.1H19.1998V12.9H8.245L13.0726 17.7276L11.8 19.0002L4.7998 12L11.8 4.9998L13.0726 6.2724L8.245 11.1Z" fill="#1DAA47"/></svg>',
  send: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M13.6333 3.19984C13.8226 2.70735 13.3298 2.22782 12.8427 2.43055L3.22578 6.4327C2.7114 6.64676 2.74111 7.38527 3.27102 7.55732L6.45667 8.59163C7.02313 8.77555 7.46194 9.22774 7.62876 9.79947L8.6265 13.2189C8.78737 13.7702 9.55638 13.8022 9.76251 13.2662L13.6333 3.19984ZM12.3816 1.32266C13.8431 0.714475 15.3214 2.15306 14.7533 3.63052L10.8826 13.6969C10.2642 15.3051 7.95716 15.2091 7.47454 13.555L6.4768 10.1356C6.42119 9.94502 6.27492 9.79429 6.0861 9.73298L2.90045 8.69867C1.31072 8.18251 1.22159 5.96699 2.76472 5.3248L12.3816 1.32266Z" fill="#1DAA47"/></svg>',
  x: '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="m2 2 10 10M12 2 2 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  // с прода: шапка повара
  chef: (s = 26) => `<svg width="${s}" height="${Math.round(s * 18 / 19)}" viewBox="0 0 19 18" fill="none"><path fill="#06C160" d="M14.14 3.303A4.93 4.93 0 0 0 9.5 0a4.93 4.93 0 0 0-4.64 3.303A4.916 4.916 0 0 0 .5 8.182a4.92 4.92 0 0 0 4.09 4.84v4.16c0 .452.367.818.82.818h8.18a.82.82 0 0 0 .82-.818v-4.16a4.92 4.92 0 0 0 4.09-4.84 4.916 4.916 0 0 0-4.36-4.879m-1.367 13.06H6.227v-1.636h6.546zm.818-4.908a.82.82 0 0 0-.818.818v.818H6.227v-.818a.82.82 0 0 0-.818-.819 3.276 3.276 0 0 1-3.273-3.272A3.276 3.276 0 0 1 5.41 4.909h.022l.044.002c.395.01.74-.268.818-.656A3.28 3.28 0 0 1 9.5 1.636a3.28 3.28 0 0 1 3.207 2.62.82.82 0 0 0 .862.654h.022a3.276 3.276 0 0 1 3.273 3.272 3.276 3.276 0 0 1-3.273 3.272"/></svg>`,
  badge: '<svg width="12" height="12" fill="none" viewBox="0 0 12 12"><path fill="#fff" fill-rule="evenodd" d="M8.397 3.911S5.751 8.524 5.705 8.565a.375.375 0 0 1-.53-.015L3.461 6.967a.375.375 0 0 1 .547-.514L5.35 7.692l2.398-4.155a.376.376 0 0 1 .65.375M6 0a6 6 0 0 0-6 6 6 6 0 0 0 6 6 6 6 0 0 0 6-6 6 6 0 0 0-6-6" clip-rule="evenodd"/></svg>',
  favS: '<svg width="12" height="12" fill="none" viewBox="0 0 12 12"><path fill="#06C160" d="M.932 6.182 6 11.25l5.068-5.068A3.18 3.18 0 0 0 12 3.932v-.143a3.04 3.04 0 0 0-5.413-1.898L6 2.625l-.587-.734A3.04 3.04 0 0 0 0 3.789v.143c0 .844.335 1.653.932 2.25"/></svg>',
  share: '<svg width="12" height="12" fill="none" viewBox="0 0 12 12"><path fill="#06C160" d="M8.25 4.5a2.25 2.25 0 1 0-2.197-1.761l-2.402 1.5a2.25 2.25 0 1 0 0 3.52l2.402 1.502Q6 9.498 6 9.75a2.25 2.25 0 1 0 .849-1.76L4.447 6.489a2.3 2.3 0 0 0 0-.978l2.402-1.5A2.24 2.24 0 0 0 8.25 4.5"/></svg>',
  pin: '<svg width="14" height="16" fill="none" viewBox="0 0 31 35"><path fill="#06C160" fill-rule="evenodd" d="M15.477 32.99c2.29-1.132 13.681-7.299 13.681-17.911C29.158 7.303 22.855 1 15.079 1S1 7.303 1 15.079C1 25.691 12.39 31.858 14.68 32.99a.89.89 0 0 0 .797 0m-.396-11.877a6.034 6.034 0 1 0 0-12.068 6.034 6.034 0 0 0 0 12.068" clip-rule="evenodd"/></svg>',
  car: '<svg width="22" height="20" fill="none" viewBox="0 0 17 16"><path fill="#06C160" d="M16.047 5.966a.214.214 0 0 0-.232-.106c-.495.018-1.007 0-1.502 0-.053 0-.088-.018-.106-.07l-.972-2.016c-.462-.991-1.24-1.54-2.37-1.521l-5.043.017a2.17 2.17 0 0 0-1.573.796L2.8 5.772c-.015.044-.042.076-.08.076l-.027-.006H1.19a.23.23 0 0 0-.23.089c-.053.07-.07.16-.053.249.07.3.16.6.247.884a.36.36 0 0 0 .372.247h.618c-.017.035-.017.053-.035.07-.16.407-.3.796-.46 1.202-.017.053-.035.107-.035.16v4.21a.8.8 0 0 0 .053.282c.053.16.141.283.283.372a.77.77 0 0 0 .442.14h1.38a.74.74 0 0 0 .495-.176.72.72 0 0 0 .265-.442c.018-.141.035-.3.035-.442v-.512h7.87v.672c0 .6.319.9.904.9h1.043c.088 0 .159 0 .247-.017a.8.8 0 0 0 .46-.265.74.74 0 0 0 .176-.495V8.866c0-.141-.017-.283-.053-.406-.07-.23-.141-.46-.23-.69-.053-.159-.106-.3-.159-.46h.619a.37.37 0 0 0 .39-.264c.089-.283.16-.566.248-.83a.25.25 0 0 0-.035-.25M3.63 6.18l1.36-2.353c.213-.337.584-.532.974-.514h4.9c.212 0 .441.035.636.106.159.07.318.179.424.302l1.68 3.007.018.053a2 2 0 0 0-.441-.106c-.338-.036-.691-.036-1.027-.053H4.55a4.8 4.8 0 0 0-1.22.123c.106-.194.212-.37.3-.565m1.896 4.176H3.551a.53.53 0 0 1-.518-.514v-.163a.44.44 0 0 1 .163-.351c.108-.082.245-.135.355-.108l1.326.162c.298.027.84.488.949.65.134.19 0 .324-.299.324m8.443-.514a.53.53 0 0 1-.518.514h-1.976c-.299 0-.435-.134-.299-.323.108-.163.65-.624.948-.65l1.327-.163c.108-.027.246.026.355.108a.44.44 0 0 1 .163.351z"/></svg>',
  chat: '<svg width="20" height="18" fill="none" viewBox="0 0 20 18"><path fill="#06C160" d="M10 0C4.502 0 0 3.993 0 8.983c0 1.569.442 3.094 1.281 4.428.451.718.493 1.739-.187 3.12-.309.626.116 1.369.812 1.435 1.357.128 2.503-.1 4.063-.75a11.3 11.3 0 0 0 4.031.75c5.498 0 10-3.995 10-8.983C20 3.993 15.498 0 10 0m0 1.996c4.443 0 8 3.156 8 6.987s-3.557 6.986-8 6.986a8.9 8.9 0 0 1-3.625-.748 1 1 0 0 0-.813 0c-.92.402-1.441.622-2.124.717.378-1.302.1-2.681-.469-3.587A6.3 6.3 0 0 1 2 8.983c0-3.83 3.557-6.987 8-6.987M6 7.985a.999.999 0 1 0 1 .998 1 1 0 0 0-1-.998m4 0a.999.999 0 1 0 1 .998 1 1 0 0 0-1-.998m4 0a.999.999 0 1 0 1 .998 1 1 0 0 0-1-.998"/></svg>',
  starProd: '<svg width="14" height="13" fill="none" viewBox="0 0 14 13"><path fill="#F5DF4D" d="m12.806 4.45-3.967-.577L7.065.278a.502.502 0 0 0-.897 0L4.395 3.873.428 4.45a.499.499 0 0 0-.277.853l2.87 2.799-.678 3.951a.5.5 0 0 0 .725.527l3.549-1.866 3.548 1.866a.5.5 0 0 0 .725-.527l-.678-3.951 2.87-2.799a.499.499 0 0 0-.276-.853"/></svg>',
};

/* ---------- состояние ---------- */
const state = { cart: { ...CART_START }, fav: {} };
const $ = s => document.querySelector(s);

/* ---------- карточки ---------- */
/* время — у каждой карточки (13.10): быстрые — зелёная молния, обычные — чёрные часы,
   долгие — красные часы и красный текст */
function timeBadge(d) {
  const t = tone(d);
  return `<div class="time ${t}">${t === 'fast' ? I.fast : I.clock}<span>${timeHTML(d)}</span></div>`;
}
function cardB(d) {
  const q = state.cart[d.n] || 0;
  const btn = d.price === null ? `<div class="btn later">Будет позже</div>` : q
    ? `<div class="btn step"><button data-dec="${esc(d.n)}" type="button">${I.minus}</button><span>${q}</span><button data-inc="${esc(d.n)}" type="button">${I.plus}</button></div>`
    : `<button class="btn" data-inc="${esc(d.n)}" type="button">${money(d.price)}</button>`;
  return `<div class="cb" data-dish="${esc(d.n)}">
    <div class="photo"><img loading="lazy" src="${IMG(d.img)}" alt="">${d.rc ? `<div class="rating">${I.star16}<span>5.0<span class="cnt"> (${d.rc})</span></span></div>` : ''}<button class="heart ${state.fav[d.n] ? 'on' : ''}" data-fav="${esc(d.n)}" type="button">${I.heart16}</button></div>
    <div class="text"><div class="name">${esc(d.n)}</div><div class="meta">${weight(d)}</div></div>
    <div class="bottom">${timeBadge(d)}${btn}</div>
  </div>`;
}

/* ---------- страница ---------- */
function overview() {
  return `<div class="overview">
    <div class="cook-card">
      <div class="cook-head"><div class="avatar">${I.chef(26)}</div><div><div class="cook-name">Марина Казанцева</div><div class="cook-spec">Домашний повар · ₽<span class="mute">₽₽</span></div></div></div>
      <div class="badge-ok">${I.badge}Повар проверен</div>
      <div class="when">Приготовлю сегодня к ${NOW + DEFAULT_H}:00</div>
      <div class="about"><p>Нет времени готовить? С удовольствием накормлю вас вкусной и домашней едой 🤍 Заказы отдаю с 13:00 до 17:00 …</p><div class="more">Читать далее...</div></div>
      <div class="cook-foot"><div class="loc">${I.pin}2.5 км от вас</div><div class="cook-actions"><span class="pill-btn">${I.favS}В избранное</span><span class="pill-btn icon">${I.share}</span></div></div>
    </div>
    <div class="actions3"><div class="act">${I.car}от 90 ₽</div><div class="act">${I.chat}Написать</div><div class="act">${I.chef(19)}О поваре</div></div>
    <div class="reviews"><div class="r">5.0<span class="stars">${I.starProd.repeat(5)}</span></div><span class="all">Все отзывы(32)</span></div>
  </div>`;
}
function tabsBar() {
  return `<div class="tabs"><span class="tabs-filter">${I.filter}</span><div class="tabs-list" id="tabsList">${CATS.map((c, i) =>
    `<button class="tab" data-go="sec-${i}" type="button">${c.icon ? I[c.icon] : ''}${c.tab}</button>`).join('')}</div></div>`;
}
function sections() {
  const card = cardB;
  return CATS.map((c, i) => `<div class="section" id="sec-${i}"><h2>${c.icon === 'fast' ? I.fastFill : ''}<span>${c.name}</span></h2>
    <div class="grid">${c.dishes.map(n => card(DISH[n])).join('')}</div></div>`).join('');
}

/* ---------- корзина и доставка ---------- */
function cartSum() { return Object.entries(state.cart).reduce((s, [n, q]) => s + DISH[n].price * q, 0); }
function renderBottom() {
  const sum = cartSum(), has = sum > 0;
  $('#app').classList.toggle('has-cart', has);
  $('#fabs').innerHTML = `<button class="fab search" type="button">${I.search}Поиск</button>${has ? `<button class="fab cart" type="button">${I.cart}${money(sum)}</button>` : ''}`;
  if (!has) { $('#fabs').style.bottom = ''; return; }
  const cur = [...DELIVERY].reverse().find(t => sum >= t.from), next = DELIVERY.find(t => t.from > sum);
  const pct = next ? Math.round(sum / next.from * 100) : 100;
  const text = !next ? 'Бесплатная доставка'
    : next.cost === 0 ? `Ещё <b>${money(next.from - sum)}</b> до бесплатной доставки`
    : `Ещё <b>${money(next.from - sum)}</b> до доставки <b>${money(next.cost)}</b>`;
  $('#delivery').innerHTML = `<div class="dl-row"><span class="dl-sum">${money(sum)}</span><div class="dl-track"><div class="dl-fill" style="width:${pct}%"></div></div><span class="dl-cost">${cur.cost ? money(cur.cost) : 'Бесплатно'}</span></div>
    <div class="dl-text">${I.delivery}<span>${text}</span></div>`;
  $('#fabs').style.bottom = $('#delivery').offsetHeight + 12 + 'px';
}

function render(keep) {
  const sc = $('#scroll'), y = sc.scrollTop, tx = $('#tabsList') ? $('#tabsList').scrollLeft : 0;
  $('#app').className = 'app v-b';
  sc.innerHTML = overview() + tabsBar() + sections();
  renderBottom();
  if (keep) { sc.scrollTop = y; $('#tabsList').scrollLeft = tx; }
  syncTabs();
}

/* активная вкладка — по прокрутке */
function syncTabs() {
  if (scrollAnim) return; // во время прокрутки по клику подсветка уже стоит на цели
  const sc = $('#scroll'), tabs = [...sc.querySelectorAll('.tab')]; if (!tabs.length) return;
  const line = sc.getBoundingClientRect().top + 70;
  let cur = tabs[0];
  tabs.forEach(t => { const s = document.getElementById(t.dataset.go); if (s.getBoundingClientRect().top <= line) cur = t; });
  setActiveTab(cur);
}
function setActiveTab(cur) {
  if (cur.classList.contains('on')) return;
  $('#scroll').querySelectorAll('.tab').forEach(t => t.classList.toggle('on', t === cur));
  // ленту вкладок двигаем сами: scrollIntoView сбивает прокрутку страницы
  const list = $('#tabsList'), l = cur.offsetLeft - 16, r = cur.offsetLeft + cur.offsetWidth + 16 - list.clientWidth;
  if (list.scrollLeft > l) list.scrollTo({ left: l, behavior: 'smooth' }); else if (list.scrollLeft < r) list.scrollTo({ left: r, behavior: 'smooth' });
}

/* Вкладки — навигация: по клику плавно прокручиваем к разделу (15.10).
   Своя анимация: встроенная smooth-прокрутка на длинном меню обрывалась. */
let scrollAnim = null; // номер текущей прокрутки; null — не идёт
function scrollToSection(id) {
  const sc = $('#scroll'), start = sc.scrollTop;
  const dist = Math.max(0, document.getElementById(id).offsetTop - 112) - start;
  stopScrollAnim();
  setActiveTab(sc.querySelector(`.tab[data-go="${id}"]`));
  if (!dist) return;
  const dur = Math.min(700, 250 + Math.abs(dist) / 15);
  const ease = p => p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
  const run = scrollAnim = Symbol();
  let t0 = null; // отсчёт от первого шага: если браузер задержал кадр, прокрутка не превратится в рывок
  // шаг — по кадру или по таймеру, что раньше: кадры в некоторых окнах приходят с задержкой
  const next = () => { let done = false; const go = () => { if (!done) { done = true; step(); } }; requestAnimationFrame(go); setTimeout(go, 34); };
  const step = () => {
    if (scrollAnim !== run) return;
    const now = performance.now(); if (t0 === null) t0 = now;
    const p = Math.min(1, (now - t0) / dur);
    sc.scrollTop = start + dist * ease(p);
    if (p < 1) next(); else { scrollAnim = null; syncTabs(); }
  };
  next();
}
function stopScrollAnim() { scrollAnim = null; }

/* ---------- шторка ---------- */
function openSheet(name) {
  const d = DISH[name], k = kind(d);
  $('#sheet').innerHTML = `<div class="shade" data-close="1"></div><div class="sheet">
    <div class="sheet-photo"><img src="${IMG(d.img)}" alt=""><button class="sheet-x" data-close="1" type="button">${I.x}</button></div>
    <div class="sheet-body">
      <div class="sheet-row"><div class="sheet-price">${d.price === null ? 'Будет позже' : money(d.price)}</div>${d.rc ? `<div class="rate">${I.star16}5.0 (${d.rc})</div>` : ''}</div>
      <div class="sheet-row sheet-meta"><span>${weight(d)}</span><span>${perPrice(d)}</span></div>
      <div class="sheet-name">${esc(d.name || d.n)}</div>
      <div class="sheet-time ${tone(d)}">${k === 'fast' ? I.fast : I.clock}<span>${isTomorrow(d) ? 'Завтра с 12:00' : `Сегодня с ${NOW + d.h}:00`} · готовится ${durText(d)}</span></div>
      <div class="sheet-desc">Описание и состав</div>
    </div>
    <div class="sheet-cta">${d.price === null ? '<button class="later" type="button">Будет позже</button>' : `<button data-inc="${esc(d.n)}" data-close="1" type="button"><span>В корзину</span><span>${money(d.price)}</span></button>`}</div>
  </div>`;
  $('#sheet').classList.add('open');
}

/* ---------- события ---------- */
document.addEventListener('click', e => {
  const t = e.target.closest('[data-inc],[data-dec],[data-fav],[data-go],[data-close],[data-dish]');
  if (!t) return;
  if (t.dataset.inc) { state.cart[t.dataset.inc] = (state.cart[t.dataset.inc] || 0) + 1; if (t.dataset.close) $('#sheet').classList.remove('open'); render(true); return; }
  if (t.dataset.dec) { const n = t.dataset.dec; state.cart[n] = (state.cart[n] || 0) - 1; if (state.cart[n] <= 0) delete state.cart[n]; render(true); return; }
  if (t.dataset.fav) { state.fav[t.dataset.fav] = !state.fav[t.dataset.fav]; render(true); return; }
  if (t.dataset.go) { scrollToSection(t.dataset.go); return; }
  if (t.dataset.close) { $('#sheet').classList.remove('open'); return; }
  if (t.dataset.dish) openSheet(t.dataset.dish);
});

$('#header').innerHTML = `<span class="back">${I.back}</span><div class="addr">${I.send}<span>г Тюмень, ул. Ленина, д 2а</span></div>`;
$('#scroll').addEventListener('scroll', syncTabs, { passive: true });
// пользователь сам взялся за прокрутку — анимацию останавливаем
['wheel', 'touchstart'].forEach(ev => $('#scroll').addEventListener(ev, () => { if (scrollAnim) { stopScrollAnim(); syncTabs(); } }, { passive: true }));
render(false);
