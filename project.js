const DENOMINATIONS = [2000, 500, 200, 100, 50, 20, 10, 5, 2, 1];

const form = document.getElementById('payment-form');
const billInput = document.getElementById('bill-amount');
const paidInput = document.getElementById('paid-amount');
const messageEl = document.getElementById('message');
const resultSection = document.getElementById('result-section');
const changeAmountEl = document.getElementById('change-amount');
const notesTableBody = document.querySelector('#notes-table tbody');
const resetBtn = document.getElementById('reset-btn');

function showMessage(msg, isError = true){
  messageEl.textContent = msg;
  messageEl.style.color = isError ? '#b00020' : '#007700';
}

function clearMessage(){ messageEl.textContent = ''; }

function calculateChange(bill, paid){
  let change = paid - bill;
  if(change <= 0) return { change, notes: [] };

  const notes = [];
  let remaining = change;
  for(const d of DENOMINATIONS){
    const count = Math.floor(remaining / d);
    notes.push({ denom: d, count });
    remaining = remaining - count * d;
  }
  return { change, notes };
}

function renderResults(change, notes){
  changeAmountEl.textContent = `₹${change}`;
  notesTableBody.innerHTML = '';
  for(const row of notes){
    const tr = document.createElement('tr');
    const tdDen = document.createElement('td');
    tdDen.textContent = `₹${row.denom}`;
    const tdCnt = document.createElement('td');
    tdCnt.textContent = row.count;
    tr.appendChild(tdDen);
    tr.appendChild(tdCnt);
    notesTableBody.appendChild(tr);
  }
  resultSection.setAttribute('aria-hidden', 'false');
}

form.addEventListener('submit', (e)=>{
  e.preventDefault();
  clearMessage();
  const bill = Number(billInput.value);
  const paid = Number(paidInput.value);

  if(!Number.isFinite(bill) || bill <= 0){
    showMessage('Please enter a valid bill amount greater than 0.');
    return;
  }
  if(!Number.isFinite(paid) || paid < 0){
    showMessage('Please enter a valid paid amount (0 or greater).');
    return;
  }
  if(paid < bill){
    showMessage('Paid amount is less than bill amount — customer still owes money.');
    resultSection.setAttribute('aria-hidden', 'true');
    return;
  }

  const { change, notes } = calculateChange(bill, paid);
  if(change === 0){
    showMessage('Exact amount paid — no change required.', false);
    resultSection.setAttribute('aria-hidden', 'true');
    changeAmountEl.textContent = '₹0';
    notesTableBody.innerHTML = '';
    return;
  }

  renderResults(change, notes);
  showMessage(`Return ₹${change} using minimum number of notes.`, false);
});

resetBtn.addEventListener('click', ()=>{
  billInput.value = '';
  paidInput.value = '';
  clearMessage();
  resultSection.setAttribute('aria-hidden', 'true');
  changeAmountEl.textContent = '₹0';
  notesTableBody.innerHTML = '';
});