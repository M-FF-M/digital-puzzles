
const ENCRYPTED_DATA = 'puzzlecrypt:eyJ2IjoxLCJhbGciOiJBRVMtR0NNIiwia2RmIjoiUEJLREYyLVNIQTI1NiIsIml0ZXJhdGlvbnMiOjIwMDAwMCwic2FsdCI6Iks1bVlRd2lycWVSUFkyUHhnNXU2WkE9PSIsIml2IjoiT2xpWkxKTTA3ZlAzbGE5VCIsImNpcGhlcnRleHQiOiJsSlFOMVBmMVZpeEJlYlVPWWNRSWRRV2hiTm5xbkpQWW9PWT0ifQ==';
let GLOBAL_ACCESS_KEY = null;
let GLOBAL_DECRYPTED_DATA = null;

async function main() {
  GLOBAL_ACCESS_KEY = localStorage.getItem('ariaccesskey');
  if (GLOBAL_ACCESS_KEY !== null) {
    const decrypted = await PuzzleCrypto.decryptString(GLOBAL_ACCESS_KEY, ENCRYPTED_DATA);
    if (decrypted === null) {
      localStorage.removeItem('ariaccesskey');
      GLOBAL_ACCESS_KEY = null;
    } else {
      GLOBAL_DECRYPTED_DATA = decrypted;
      document.getElementById('login-form').style.display = 'none';
      document.getElementById('pwd-forgotten-form').style.display = 'none';
      document.getElementById('recovery-form').style.display = 'block';
    }
  }

  document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    if (document.getElementById('pwd-forgotten') === null) {
      const tr1 = document.createElement('tr');
      const td1 = document.createElement('td');
      tr1.appendChild(td1);
      const tr2 = document.createElement('tr');
      const td2 = document.createElement('td');
      tr2.appendChild(td2);
      const label = document.createElement('label');
      label.setAttribute('for', 'pwd-forgotten');
      label.classList.add('error-label');
      const span1 = document.createElement('span');
      span1.classList.add('material-symbols-outlined');
      span1.textContent = 'warning';
      const span2 = document.createElement('span');
      span2.textContent = 'ID or password is wrong';
      label.appendChild(span1);
      label.appendChild(span2);
      td1.appendChild(label);
      const btn = document.createElement('button');
      btn.setAttribute('id', 'pwd-forgotten');
      btn.classList.add('light', 'small-space');
      btn.textContent = 'PASSWORD FORGOTTEN';
      td2.appendChild(btn);
      document.getElementById('login-table').getElementsByTagName('tbody')[0].appendChild(tr1);
      document.getElementById('login-table').getElementsByTagName('tbody')[0].appendChild(tr2);

      btn.addEventListener('click', () => {
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('pwd-forgotten-form').style.display = 'block';
        document.getElementById('conf-employee-id').value = document.getElementById('employee-id').value;
      });
    }
  });
  
  document.getElementById('pwd-forgotten-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    document.getElementById('conf-btn').disabled = true;

    const key = `${document.getElementById('conf-employee-id').value}_${
      document.getElementById('conf-fname').value.toLowerCase()}_${document.getElementById('conf-lname').value.toLowerCase()}_${
      document.getElementById('conf-birth').value}`;
    
    const decrypted = await PuzzleCrypto.decryptString(key, ENCRYPTED_DATA);

    document.getElementById('conf-btn').disabled = false;
    if (decrypted === null) {
      if (document.getElementById('conf-error') === null) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        tr.appendChild(td);
        const label = document.createElement('label');
        label.setAttribute('id', 'conf-error');
        label.classList.add('error-label');
        const span1 = document.createElement('span');
        span1.classList.add('material-symbols-outlined');
        span1.textContent = 'warning';
        const span2 = document.createElement('span');
        span2.textContent = 'Information is incorrect';
        label.appendChild(span1);
        label.appendChild(span2);
        td.appendChild(label);
        document.getElementById('pwd-forgotten-table').getElementsByTagName('tbody')[0].appendChild(tr);
      }
    } else {
      GLOBAL_ACCESS_KEY = key;
      GLOBAL_DECRYPTED_DATA = decrypted;
      localStorage.setItem('ariaccesskey', key);
      document.getElementById('pwd-forgotten-form').style.display = 'none';
      document.getElementById('recovery-form').style.display = 'block';
      // TODO
      // alert(decrypted);
    }
  });
  
  document.getElementById('recovery-form').addEventListener('submit', (e) => {
    e.preventDefault();
  });
}

