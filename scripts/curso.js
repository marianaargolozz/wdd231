// Conclusões verificadas no histórico acadêmico enviado (06/11/2026).
// Confira o array oficial do Canvas para as propriedades adicionais exigidas.
const courses = [
  { subject: 'CSE', number: 110, title: 'Introduction to Programming', credits: 2, completed: true },
  { subject: 'WDD', number: 130, title: 'Web Fundamentals', credits: 2, completed: true },
  { subject: 'CSE', number: 111, title: 'Programming with Functions', credits: 2, completed: true },
  { subject: 'CSE', number: 210, title: 'Programming with Classes', credits: 2, completed: true },
  { subject: 'WDD', number: 131, title: 'Dynamic Web Fundamentals', credits: 2, completed: true },
  { subject: 'WDD', number: 231, title: 'Web Frontend Development I', credits: 2, completed: false }
];

const list = document.querySelector('#courseList');
const total = document.querySelector('#totalCredits');
const filterButtons = document.querySelectorAll('.filter');

function renderCourses(subject = 'ALL') {
  const filtered = subject === 'ALL' ? courses : courses.filter(course => course.subject === subject);
  list.replaceChildren();

  filtered.forEach(course => {
    const card = document.createElement('article');
    card.className = `course-card${course.completed ? ' completed' : ''}`;
    const name = document.createElement('span');
    name.textContent = `${course.subject} ${course.number} — ${course.title}`;
    const status = document.createElement('span');
    status.className = 'status';
    status.textContent = course.completed ? '✓ Concluído' : 'Em andamento / pendente';
    card.append(name, status);
    list.append(card);
  });

  total.textContent = filtered.reduce((sum, course) => sum + course.credits, 0);
  filterButtons.forEach(button => {
    const active = button.dataset.filter === subject;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

filterButtons.forEach(button => button.addEventListener('click', () => renderCourses(button.dataset.filter)));
renderCourses();
