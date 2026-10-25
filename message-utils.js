(function (root) {
  'use strict';
  const clean = value => String(value ?? '').trim();
  function buildMessage(kind, values) {
    const name = clean(values.student);
    const grade = clean(values.grade);
    const lines = [kind === 'question' ? 'السلام عليكم أستاذ عبدالرحمن، عندي سؤال في الكيمياء.' : 'السلام عليكم، حابب أستفسر عن مجموعات الأستاذ عبدالرحمن الضبع.', ''];
    if (name) lines.push('الاسم: ' + name);
    lines.push('الصف الدراسي: ' + grade);
    if (kind === 'question') {
      if (clean(values.topic)) lines.push('الموضوع: ' + clean(values.topic));
      lines.push('السؤال: ' + clean(values.question));
    } else {
      if (clean(values.notes)) lines.push('المنطقة أو الموعد المناسب: ' + clean(values.notes));
      lines.push('', 'ممكن أعرف المجموعات والأماكن والمواعيد المتاحة لهذا الصف؟');
    }
    return lines.join('\n');
  }
  function whatsappUrl(phone, message) {
    if (!/^\d{10,15}$/.test(phone)) throw new Error('Invalid public contact number');
    return 'https://wa.me/' + phone + '?text=' + encodeURIComponent(message);
  }
  const api = Object.freeze({ buildMessage, whatsappUrl });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.TeacherMessages = api;
})(typeof window !== 'undefined' ? window : globalThis);
