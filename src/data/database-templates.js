const module_template = {
  _id: 'ObjectId',
  type: 'exam',
  approved: false,
  completed: false,
  creator: '5c13eef9dced5f7e2420fca8',
  date: 1545142116692, // creation date
  exam: {
    '1': {
      // Question 1
      answers: {
        A: 'qsdf',
        B: 'sdf',
        C: 'qsdf',
        D: 'qsdfsqdf',
        E: 'qfsqf',
      },
      correctAnswers: ['D', 'A'],
      question: 'dsf',
    },
  },
  module: 'Anatomy', // Name of module
  session: '1',
  seen: '0',
  examDate: '0354545454', //timestamp,
  examProof: 'http://...',
  university: 'Annaba',
}

const user_template = {
  _id: 'ObjectId',
  type: 'user',
  authId: '4qsd6f4d56f456',
  university: 'Annaba',
}

const review = {
  _id: 'ObjectId',
  type: 'review',
  creator: '4qsd6f4d56f456',
  module: 'Gastrologie',
  date: '05456465464',
}

const passedExam = {
  _id, 'ObjectId',
  type: 'passed-exam',
  reviewId: '5s5d5f4544',
  examId: 456465,
  module: 'jjfkls',
  university: 'annaba',
  examDate: 05654564,
  grade: 5,
  maxGrade: 20,
}

const report_template = {
  _id: 'ObjectId',
  type: 'report',
  examId: '5cqs54f4',
  questionNum: '5',
  reportMessage: 'foo',
  creator: '5c13eef9dced5f7e2420fca8',
  corrected: false,
  date: '065554567865',
}

const message_template = {
  _id: 'ObjectId',
  type: 'message',
  creator: '5c13eef9dced5f7e2420fca8', // Optional
  name: '',
  email: '',
  message: 'bar',
  date: '005454748',
}
