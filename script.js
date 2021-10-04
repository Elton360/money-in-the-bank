'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Elton Lucien',
  movements: [
    { amt: 200.0, transDate: '2019-11-18T21:31:17.178Z' },
    { amt: 455.23, transDate: '2019-12-23T07:42:02.383Z' },
    { amt: -306.5, transDate: '2020-01-28T09:15:04.904Z' },
    { amt: 25000.0, transDate: '2020-04-01T10:17:24.185Z' },
    { amt: -642.21, transDate: '2020-05-08T14:11:59.604Z' },
    { amt: -133.9, transDate: '2020-05-27T17:01:17.194Z' },
    { amt: 79.97, transDate: '2020-07-11T23:36:17.929Z' },
    { amt: 1300.0, transDate: '2020-07-12T10:51:36.790Z' },
    { amt: 150.0, transDate: '2021-10-02T10:51:36.790Z' },
  ],
  interestRate: 1.5, // %
  pin: 1111,
  currency: 'USD',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Alicia Saenz',
  movements: [
    { amt: 5000, transDate: '2019-11-01T13:15:33.035Z' },
    { amt: 3400, transDate: '2019-11-30T09:48:16.867Z' },
    { amt: -150, transDate: '2019-12-25T06:04:23.907Z' },
    { amt: -790, transDate: '2020-01-25T14:18:46.235Z' },
    { amt: -3210, transDate: '2020-02-05T16:33:06.386Z' },
    { amt: -1000, transDate: '2020-04-10T14:43:26.374Z' },
    { amt: 8500, transDate: '2020-06-25T18:49:59.371Z' },
    { amt: -30, transDate: '2020-07-26T12:01:20.894Z' },
  ],
  interestRate: 1.2, // %
  pin: 2222,
  currency: 'USD',
  locale: 'pt-PT', // de-DE
};

const account3 = {
  owner: 'Gabriel Mackenzie',
  movements: [
    { amt: 50000, transDate: '2019-11-18T21:31:17.178Z' },
    { amt: 4255.23, transDate: '2019-12-23T07:42:02.383Z' },
    { amt: -3506.5, transDate: '2020-01-28T09:15:04.904Z' },
    { amt: -25000, transDate: '2020-04-01T10:17:24.185Z' },
    { amt: -42.21, transDate: '2020-05-08T14:11:59.604Z' },
    { amt: -13.9, transDate: '2020-05-27T17:01:17.194Z' },
    { amt: 179.97, transDate: '2020-07-11T23:36:17.929Z' },
    { amt: -1300, transDate: '2020-07-12T10:51:36.790Z' },
  ],
  interestRate: 1.2, // %
  pin: 3333,
  currency: 'USD',
  locale: 'pt-PT', // de-DE
};

const account4 = {
  owner: 'Jonas Fisher',
  movements: [
    { amt: 2000, transDate: '2019-11-18T21:31:17.178Z' },
    { amt: -455.23, transDate: '2019-12-23T07:42:02.383Z' },
    { amt: -36.5, transDate: '2020-01-28T09:15:04.904Z' },
    { amt: 2000, transDate: '2020-04-01T10:17:24.185Z' },
    { amt: -62.21, transDate: '2020-05-08T14:11:59.604Z' },
    { amt: -13.9, transDate: '2020-05-27T17:01:17.194Z' },
    { amt: 79.97, transDate: '2020-07-11T23:36:17.929Z' },
    { amt: 100, transDate: '2020-07-12T10:51:36.790Z' },
  ],
  interestRate: 1.2, // %
  pin: 4444,
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const accountLogOut = {
  owner: '',
  movements: [{ amt: '', transDate: '' }],
  interestRate: '', // %
  pin: 0,
  currency: '',
  locale: 'pt-PT', // de-DE
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelLogoutTimer = document.querySelector('.logout-timer');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferDrop = document.querySelector('.form__select');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const movementsRow = document.getElementsByClassName('movements__row');

let currentAccount;
let noActivityTime = 0;
let countDown = 180;

const displayMovements = function (acc, sort = false) {
  if (!acc.owner) {
    containerMovements.innerHTML = '';
    return;
  }

  containerMovements.innerHTML = '';

  const movSort = sort
    ? acc.movements.slice().sort((a, b) => b.amt - a.amt)
    : acc.movements.slice().sort((a, b) => a.amt - b.amt);

  //console.log(movSort);

  movSort.forEach(function (mov, i) {
    let transDate;
    const type = mov.amt > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(mov.transDate);
    const locale = navigator.language;

    const calcTimePassed = function (givenDate) {
      let daysPassed = Math.trunc(
        (new Date() - new Date(givenDate)) / 86400000
      );
      if (daysPassed < 1) transDate = `TODAY`;
      else if (daysPassed === 1) transDate = `YESTERDAY`;
      else if (daysPassed <= 7) transDate = `${daysPassed} DAYS AGO`;
      else transDate = new Intl.DateTimeFormat(locale).format(date);
    };

    const formattedMov = formatCurrency(mov.amt, locale, acc.currency);

    calcTimePassed(mov.transDate);
    const html = `<div class="movements__row">
      <div class="movements__type movements__type--${type}"></div>
      <div class="movements__date">${transDate}</div>
      <div class="movements__value">${formattedMov}</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });

  [...movementsRow].forEach(function (mov, i) {
    if (i % 2 != 0) mov.classList.add('light-color');
  });
};

const formatCurrency = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const createUsernanmes = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUsernanmes(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

const calcDisplayBalance = function (acc) {
  if (!acc) return;

  acc.balance = acc.movements.reduce((acc, mov) => acc + mov.amt, 0);
  labelBalance.textContent = formatCurrency(
    acc.balance,
    navigator.language,
    acc.currency
  );
};

const calcDisplaySummary = function (acc) {
  if (!acc) return;

  const incomes = acc.movements
    .filter(mov => mov.amt > 0)
    .reduce((acc, mov) => acc + mov.amt, 0);

  const withdrawals = acc.movements
    .filter(mov => mov.amt < 0)
    .reduce((acc, mov) => acc + mov.amt, 0);

  const interest = acc.movements
    .filter(mov => mov.amt > 0)
    .map(mov => (mov.amt * acc.interestRate) / 100)
    .filter(mov => mov > 1)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = formatCurrency(
    incomes,
    navigator.language,
    acc.currency
  );
  labelSumOut.textContent = formatCurrency(
    Math.abs(withdrawals),
    navigator.language,
    acc.currency
  );
  labelSumInterest.textContent = formatCurrency(
    Math.abs(interest),
    navigator.language,
    acc.currency
  );
};

const transfer = function (e) {
  e.preventDefault();
  let amount = Number(inputTransferAmount.value);
  let receiverAcc = {};

  for (let i = 0; i < accounts.length; i++) {
    if (accounts[i].userName === inputTransferDrop.value) {
      receiverAcc = accounts[i];
      break;
    }
  }

  inputCloseUsername.value = inputClosePin.value = '';

  //console.log(currentAccount.movements);
  //console.log(receiverAcc.movements);

  if (amount > 0 && currentAccount.balance >= amount && receiverAcc) {
    // Doing the transfer
    currentAccount.movements.push({ amt: -amount, transDate: new Date() });
    receiverAcc.movements.push({ amt: amount, transDate: new Date() });
    updateUI(currentAccount);
  }

  inputCloseUsername.value = inputClosePin.value = '';

  //console.log(currentAccount.movements);
};

const closeAcc = function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.userName &&
    Number(inputClosePin.value) === Number(currentAccount.pin)
  ) {
    const index = accounts.findIndex(
      acc => acc.userName === currentAccount.userName
    );
    //console.log(index);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
};

const loan = function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some(mov => mov.amt >= amount * 0.1)
  ) {
    setTimeout(function () {
      currentAccount.movements.push({ amt: amount, transDate: new Date() });

      updateUI(currentAccount);
    }, 5000);
  }

  inputLoanAmount.value = '';
};

const dateActualizer = function () {
  const dateObj = {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'long',
  };

  const locale = navigator.language;
  setInterval(function () {
    labelDate.textContent = new Intl.DateTimeFormat(locale, dateObj).format(
      new Date()
    );
  }, 1000);
};

dateActualizer();

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    containerApp.style.opacity = 100;
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    labelLogoutTimer.classList.add('hidden');

    displayMovements(currentAccount);
    calcDisplaySummary(currentAccount);
    calcDisplayBalance(currentAccount);
    otherUsers(accounts, currentAccount);
  }
  const inputTransferTo = document.querySelectorAll('.transferTo');

  btnTransfer.addEventListener('click', transfer);
  btnClose.addEventListener('click', closeAcc);
  btnLoan.addEventListener('click', loan);

  let min;
  let sec;

  document.addEventListener('click', function (e) {
    e.preventDefault();
    noActivityTime = 0;
    labelLogoutTimer.classList.add('hidden');
    countDown = 180;
  });

  let counter = setInterval(function () {
    noActivityTime++;
    //console.log(noActivityTime);

    if (noActivityTime >= 120) {
      countDown--;
      min = Math.trunc(countDown / 60);
      sec = countDown % 60;
      labelTimer.textContent = `${`${min}`.padStart(2, 0)}:${`${sec}`.padStart(
        2,
        0
      )}`;
      labelLogoutTimer.classList.remove('hidden');
      if (countDown <= 0) {
        clearInterval(counter);
        displayMovements(accountLogOut);
        labelBalance.textContent =
          labelSumIn.textContent =
          labelSumOut.textContent =
          labelSumInterest.textContent =
          labelDate.textContent =
          labelWelcome.textContent =
            '';
        currentAccount = accountLogOut;
        containerApp.style.opacity = 0;
      }
    }
  }, 1000);
});

let sorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  //console.log(sorted);

  displayMovements(currentAccount, !sorted);

  sorted = !sorted;
});

const otherUsers = function (accounts, currentAcc) {
  inputTransferDrop.innerHTML = '';
  currentAccount = currentAcc;
  inputTransferDrop.insertAdjacentHTML(
    'beforeend',
    '<option value="" class="transferTo"></option>'
  );
  accounts.forEach(function (acc) {
    if (acc.userName != currentAccount?.userName) {
      const html = `<option value="${acc.userName}" class="transferTo">${acc.owner}</option>`;

      inputTransferDrop.insertAdjacentHTML('beforeend', html);
    }
  });
};

/////////////////////////////////////////////////

const password = 'Password123';
let includesCapitalLetter = false;
let includessymbol = false;
let includesNum = false;

for (let letter of password.split('')) {
  if (letter.charCodeAt(0) > 65 && letter.charCodeAt(0) < 90)
    includesCapitalLetter = true;
  if (letter.charCodeAt(0) > 48 && letter.charCodeAt(0) < 57)
    includesNum = true;
  if (
    (letter.charCodeAt(0) > 32 && letter.charCodeAt(0) < 47) ||
    (letter.charCodeAt(0) > 58 && letter.charCodeAt(0) < 64) ||
    (letter.charCodeAt(0) > 91 && letter.charCodeAt(0) < 96) ||
    (letter.charCodeAt(0) > 123 && letter.charCodeAt(0) < 126)
  )
    includessymbol = true;
}

//console.log(includessymbol, includesNum, includesCapitalLetter);

const object = {
  button: {
    Touchable: {
      alignItems: 'center',
      paddingTop: 10,
      paddingBottom: 10,
      paddingLeft: 30,
      paddingRight: 30,
    },
    Text: {
      color: 'white',
      fontWeight: 'normal',
    },
  },
  buttonInactive: {
    //  ...object.button,
  },
};
