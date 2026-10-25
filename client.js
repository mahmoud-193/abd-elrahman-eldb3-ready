'use strict';
const config = window.SITE_CONFIG;
const messages = window.TeacherMessages;
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');
function closeMenu() {
  nav.classList.remove('is-open');
  menu.setAttribute('aria-expanded', 'false');
}
menu.addEventListener('click', () => {
  const expanded = menu.getAttribute('aria-expanded') === 'true';
  nav.classList.toggle('is-open', !expanded);
  menu.setAttribute('aria-expanded', String(!expanded));
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menu.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header')) closeMenu();
});
window.matchMedia('(min-width:801px)').addEventListener('change', closeMenu);
document.querySelector('#year').textContent = new Date().getFullYear();
const gradeSelect = document.querySelector('#group-grade');
const stages = document.querySelectorAll('.stage');
function syncStages() {
  stages.forEach(button => {
    const selected = button.dataset.grade === gradeSelect.value;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
}
stages.forEach(button => button.addEventListener('click', () => {
  gradeSelect.value = button.dataset.grade;
  syncStages();
}));
gradeSelect.addEventListener('change', syncStages);
const dialog = document.querySelector('#message-dialog');
let dialogTrigger;
function closeDialog() {
  dialog.close();
  dialogTrigger?.focus();
}
document.querySelectorAll('.dialog-close,.dialog-edit').forEach(button => button.addEventListener('click', closeDialog));
dialog.addEventListener('click', event => { if (event.target === dialog) {
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeDialog();
}});
document.querySelectorAll('form[data-kind]').forEach(form => form.addEventListener('submit', event => {
  event.preventDefault();
  const questionField = form.querySelector('[name="question"]');
  if (questionField) {
    questionField.setCustomValidity(questionField.value.trim() ? '' : 'اكتب سؤالك قبل المتابعة.');
  }
  if (!form.reportValidity()) return;
  const values = Object.fromEntries(new FormData(form));
  if (!config.grades.includes(values.grade)) return;
  const message = messages.buildMessage(form.dataset.kind, values);
  document.querySelector('#message-preview').textContent = message;
  document.querySelector('#send-message').href = messages.whatsappUrl(config.phone, message);
  dialogTrigger = form.querySelector('[type="submit"]');
  dialog.showModal();
}));
document.querySelector('#ask-question').addEventListener('input', event => event.currentTarget.setCustomValidity(''));
document.querySelector('[data-contact="payment"]').href = messages.whatsappUrl(config.phone, 'السلام عليكم، حابب أستفسر عن تفاصيل مجموعات أستاذ عبدالرحمن الضبع وطريقة الحجز.');
