
const ENCRYPTED_DATA = 'puzzlecrypt:eyJ2IjoxLCJhbGciOiJBRVMtR0NNIiwia2RmIjoiUEJLREYyLVNIQTI1NiIsIml0ZXJhdGlvbnMiOjIwMDAwMCwic2FsdCI6InRSMW90OEpQa3NTa2d3ek5sSlNhamc9PSIsIml2IjoiSVZvSEhuamZIN21JajFseSIsImNpcGhlcnRleHQiOiJidTRkWU12OGQzaWRmR1dPdnhKeWxkLzI0S3ZQUFNLZ242cmJ3TzVXS0lYZnNKUnpqNEY5U2V3Z0Zpb21oZ1NxcnA2Z2FLaCtCUXgraHUxQ3pMMk1tdHJxMGg2YzJOeU1ZNzQxQmVWTmYwa1dpakdLUlJjYjFsMHhCRmZJRXRIZVFFN3JzZTVUeFJnUDVJUG9BdlV3czM4Z3J3VW9rZHRRQ3JYVDZ5T21jVkx6STB4VW1qYzNKN1o4a1FIRHVOV1pRVGJPR3BlL3RFZzBRbTJpeFlFdlJnS1JRRUpnclhRQmZqNC9nbzhxRndkZDlQUCt0ZlMwdnQ0RTNZZEt1Z2RDWWZ3aC9ZU0M1MGpxUXdId2xLL0JaNUtJckJDVHVqT2tIRXhUbkI1SEtKRDl5MzhueTY5aDhTZlBMMm1NOG5CeTdWNndYcWZCZkUrZndqMkdrSGZkVmMvZXhKckpneFcvUVpwYnNPQjh3S1p4UEpkbWxqQktnNExpL2tCQTVmY0tnU1p6R0l5SmM1ZlFHcDVMMjl5WFdMVUpnZmxiSGFNS2ZkQXpTdDgwU2VZN2hmS3hreVg2NmFZVmdXcnVmdDBDVWNEWFgyeVJQYXpvS2c0NDR6RTBaMHQ5ZzY5UGhibkxCbWhvQUVRQmExSEgwcjJORTVhd3ptam1wUXhDZW11NXpSbk5OVEZic01xeVFwRUNjQ0QvbE4vT0hMNC83ajVncTJFZTltUmE2Tjd3OGtoa3M2SHN3RXdNcTdCaExtOG9VSWpVYjVlODVxTkVHRlRSdXA0alZtNDlBNDZIb3dqaFBFUnp4bm1wSDlMazgyQzg0WEEwNnVZNzFnRkRYekhlUEZQNzNZWjRDcGFsMit4cm9pV0JLNXIyT1JRekZLTXU2QWRTN0VsZEtzRHBZWUx4QlBucS8zVThWbnVRckNlRWFGdDBNVHNhL2tBOFZpL1pvejdvemc0Z1hRNURJcGt2cmNLbks2c1VkQ0tGQ1lLdjMvWGJWQVg0MENDNi9GcFZaMjBYY3l5dlMwajQwaUdVZzJaQlMvb05jeEt1V1VoL2xUWkZYVmZ1ZUNYYU40YVpGbCtzTDRDNVpleW5RQUd2UWNvVTQrUExCZVFRM01saGx6SHNsUHZ3Vy9uQkFXWUFQY0FjSXU2c3JNVmpLclF3UmV4eEpWZE15U1JVTkV5NW1QblZPYlQxMG1GZlgxWW1zM2NBOWpmVTRoa1ZSQmEwNUFEL1QwYkZXaXJNcElJTFB4d1FuRE5hdHFMdFpmYXY1SnZTN0ZSUjBKUlM4eUFPQ1hiYy9jZUN6d3hFT3Ftejg3Z3dTWVBvV29pRlRaQ1VRdkQwRU5oeVcya3lHMzVyOE9uNk1UV3k4V1hLR3VyNzlDaklTZXVCTnA3alVtZDhvS25PZFltcm9oN0loYUx5a3laWWhjSVY5ZmtQM2ZtODgvM2NXRVNWZzUvTzdPT2VQaUgzUUhXcmo4MXF6dVpNc2FUSHVCZWlWMy9UMFhkRjhjeWNMMXI4UFkvcjIvanoxdDhZRkZjTVJSdUVac292b2NmamhjTDlCRktmQzNTZTFZaFljSFhiSEt3SHgwZTFHU1BHYzZnbVc4MWUwbjFsMmFrVVhad2pURjFVWVR1TFNleCtCa2JGMHZiMTVPSklTUzhpQXE1SE9pVTd3MkFJNzIxRUZsLzcySlBoNzc1RWdEV2ZCZ2o5a2xTcXVVT3QvQm8rdDhSeVhFYjVKU3JSU3FNT3VKVXM3dVpZOVNnUGk2MXovcUlCRERaN0dKN2thbmQvM0xSYlNYMXJlZzQxUllSODBuMmdhNURnZ3pPSjFKVy9MNFYyVExRTlpEdmZNczU5ZUt3OEJKWDc1VDIyS2VTWUZJb1ROWC9pMzIrcCsvbmRHRUwxU08zcnZVSmFMd0ViNVVDY3RpSlYvLzMyM0hvK041aWEvZ0lJZ3dMOEJKNUo0ZmRTcjJwSGQvTTVpQ3BuNnJobmlyMmxnNWtvZzFGTVMyYklTWTNDNmdzY1dDbzcyM29JNStUcGdXQnZ3aHpqTWFnOEl4d3pKeVFJdTI0YUpNUTFCWXVpOVpsSXhSTmR0dlRleDBEVlFvSGYvakU1VFpmVC95YzlsVVpaZmdqcDkvalMwd0UvZU0vanJNN3JiRFZ0Sjh0b25wN21RR0p6enNZdS9UMnBNOEYxcE9HTHg2UEREbEszQ1QvR3RGSmZIY3BRcVFWU1dqallGdXU3UnBPVmNEcmYyR01yWndCOVhPTzcxTzg5aFFid1VzL0xRU1owVHUyZm96VFBmamYwbmlxRkJRbFB0WDdvR2d6OHg1S2VNa2pnYWI5b043SGRNTUo2NGZBZEJFSlRHR1JtUVdaVHY2dkNySUVQOEIyWXdKMFIrSVB1RlVMbVd2alprQnNqRmo2eFZVRWlnV1hqSS85am1Namt2Sk5oV05POHZOVDRtZmFwWU0zZ0F3TFVDY2NFL05MSWcvVUpSSUtQRFY4OHVjNi9EMmd2eStobVBRNkY2d09TTzM5dHg2a0t3ODZSQVI0dkttRGdMYzhwQm1sQWVpN2wzTUpwR3dXc3NrdVNONWdqOXVid1drc3dRcXRHM09VRnc2UjduNTE1SE9UN0tacEJ5VERLUUNYc0xGOWFmMWFCcUpOZklNcC9GYzhiVHVmS3I4V2FhdWVMVWFDajkweCtaa1pnZTh5eDZOZUc2b0hUbERiWEZiN1QwQkVpM2FTeGR4YXpSMWZubUhwcXdZalpUYko4SkpLazArUmdkRXl0SEN4TzBjK2hhNWtiUm54Z2ZzUzFOSjdLWmtnb2JsYzVJNE1EelM4QXFKTlNrQ2tYWU1xbms3T3c2cGJtb0hNa1hOeGtxeGhxTjdEQnhVRFdvcElVWmVjRFFCVXBQT0V6dTdGdHlQUEhRK0ZwbXBWV1QwK3FpVFFLWEd2eWZlZU82R2VqTVpsOEIvakVaQ1ZuK21FT0gwN1Fta2JVMkNMZVV2clpNQmQraG9xMkpEaEd0ZS8wM3A1Ujc2TjFzaVdxdUpPVFpoY2RJRGMrbzlvK0V5TGdRVElrK3JsUUNBa2Y1dExGaEFteTdSQ2xpOU4xeVMyUmtYRUxCallETStWdmoxZkVvQ1dpZ2VEbWg4MlIzZllCeklyZ0U0S1VoNy9PTW1MUklyWnU1K3VrU2ExSDh6WmExUlpkWDR5OHdJdlZFdFJRZDdsWEh0cWVpRXQzUkpERCtta0d0OUY5MUsvYXhlM3VPaEdueHdKZnhjYW9rdlkyZWtXaXZNOFFnZEdHWWV1VVQySS8wdTYrUEZXVkJwNGtJNkRrMDFhQkdZYis0THphMzg4MEUyNTRDVGtVSGtmRlUxYnZqc0cvTXp6S0NwOWlYaXV2VHVZNmhHNzVOcEc3aXVLazJUTGgxZGlDS1NyMEs3RFB1UUtwa2E5aXNFVEw5MkhXMW9LOHZGa2c3OGNqc1VFeDI5WjJSckZoOTJuK2JUQzNYOE1CanFLanV2SWN2dEZwSFFGd0dBcEE1eEZiSW9ORUZmQW1ER0N3b2dmQ25uZUN5RnNNMzVFMGIra1czYzVKeFFobklTSUJ5dHZvQkFnVjhnMmhNU1crdmRWZWFUK2dRdThxTzQzMlh5K0NwcU1uL3hOcFJweXF6OXhiVFhqQU5ONmthampOVUZjZWYwVXVHcVV4U2RSQlJiQ04wbUZPZVlVZE1FeHd6VWtST3lBNE5WbzZic294M2Z2eWttVnUyZ0x0bGNBOXJqK0dyY0VRWHJ1Z2pKVVZZeWZzOUZhNEZ4WUVMK3ZtNFZwc2s2RUhQMUQxK2dUb2Nhd09ud3VaR1Nid29td3dEdVN2TWE0bVlMQk52d2xRMEh2NmdwRU5FOGhlc25HUGNWZDFtN0o2Q0J0VUdlVlhGVnh4Z21SSm9aNmhOMnBpUEwvdmJhcGRkUS9kOGFZbUx5eENYWTUyRm1PMkxOSHpjVW5yTVlxcGRCZG4zTzZiQmo3dXBacDVob2RFNE5VbkpFaW55SmIzdkhvYVg2YzRscExWbkxqdDQyZU9QYXRWWlFyQlZ5Q0dZUjhwTnNwTjJVV0pNNE1DeHJQVEtLOUx5YlFkdWtmZVk1SnJMbzJKajk1anRiSE05eXIvMWpENmFtcjM0RlBNR051ZElDLzI1ZlhWSUY2YW5zZFY1eFdkK2VUN1hCYnBkT1p3MUN2M1FIVmo3MlJNYXZoVEZUWTk4RTN3dVM4eEZveW1BTldLN09IN0lXK1VxVnVXK2pVem15N0lsd2VNd2Rsb0I0MTRpM0hySkNRMEc4d0JsWkFiNWFkSGN3NDBBWHVqamgrNXRHS1BHYXVSM3FUNUhlTUxPMGppTjEycW1pVFlubW42OUlkTjYwcEZidDNpdjNTV1Z2b1YwS3E3ZE9ldlYxdWtzMTZGWEwwZ0pPTHd4bnNtZWRSNWlkK283NjdDa21Pa21nYXc5akRXc1RlZEJJekdnZmhXZFgyV01UNi9GWkRqT0Y2cXU1N01Xb2wrSUVQUjFRdE1yZTRhOU5CNGlZbitYb2pqNzdtUWY0QWZrc3NCd0tIS1VSL0U5QjNwZEMwaWIvK0l2MGJvQmt6cytwK2tMUXZyL05GMVQ4eGVVNXRETW81ZGNmZGFyOVBza0dZYU5EZ0U2aHV1THJRZmUyc01uQ2FFSGg1ZGRnQ25PZ0VSNURJQkM1Q3JKNVBJSFpuRUhldU56V1FYOGdNU3NDdHhDVXZLZDZFMnVzaVNHb2dwekprOXk4b0pERC9pekFZRU9VSW9BVkZSaUoydTFocEpQTDF4SnFDc2dhVGdUUlJaWEhNU3JNaDFycXBoWVkwMDVBVnNsdEZXamZabG1welJ6a0J3ZUdLUzVHaENqTzB2alBhRCtuVHBNTTFOUnN3Y1FnVG95NjJsUTRPeUhxbDltUGNHRTdxQmhmUjN6TERFRmc2S0NFNnpDRXltWUxhbDZQa2JTbUgvUXFDK2hWN09laHB6NU5wWTh0L09RWEhaWFljVGlWR0p2VE0rN3N2bnB1dmI3WEJVeEVLVWlXL0FkTDkrbjJ0SHZaaWRCeHlVMmJjeVJ3NU5uaC8yZVAzUWRQYUpIK2dQeEp6ZFI3NVpOdUU2ZjlGVjBzTStRYlUwdTdldkRpSENiR1B6V2I3S3VWR0V0R0F5N0RCN2NkTkpQSWxNRnNOS3VROVh6ZnA1ekF4TUpVRXdEaktNcVVVNUQyQ1Y1MDlYVG1GZGN6MlNSaUIwbjR0REhCNElPc25iWEEyeDFGeDBOTG5MdVhOcEx6cFJoeHE5b0ZyVWNZOEZJOGxacjJuMGNES20rbFp0M1lyRWVJRWdCQXdHTmRCbDBjREg4dTFrUFVNWnJIRFN3N1JqS25iTkZBMzczWFR2cHdkeGN2Q2FOOWNYZkdISHk1Q0dGekRwQzlub09vNHBjK051OGNEdElnTFdzL1BXQmprbHR2RzBxcmpQQ3ExWDJieTRFR0twZmhiK2pnSkozYWFhSFJ0eTdkSTBGZm5iTW5Cc01jbDBEN2pYY2piY1IvUWVYVW91SjdmblIyck9xa21SLzVIcHFkZW1OZWdGd3lGYXNYcWhYNEZqeDhEdlJIUmhDcko4d3RDalJsZ1VKTTdKRGtnbGpxUFJnVUlnWjdocWFENGt3NUp6RHh2Q1pVTVJSWWIvc2ZYOHlQZ0Q2eHB2cTJCWWQrcUZHZDJQdnlRWU9VejB1U004TWU2dWg1dXVJSzRDYUcyVE9pRjVzdm1US3hmYlY2UGlwTXpKZVRCRnU4V2hrd1JudVdYYXFrMnlIQW1FWjNEM3VhVHRDQlFPTUxRb3EzN2hQNGpKbmhZN2tuOE9CNmovY25LS0RXdndyQ1RGcjVQRmJjUHVtWkhNUlFUU1pIVkZNSHFZdVkvTkxtaitZeld6OEhjSnpabFNNL1dmdWdvOTd6QzhPaDQra2pGTG9HZHAzV1NSYTJRWVR2S2ZFaHdvZTJxcU44bjBvTC94UUg1R25SR1M1N2lheFVzR3J1dWlYa056dzRXOXRsT2xZZ0d2VGpQZTkyNlo4SEZCSEN1UmtDMUJXU3ZtSXI5YW1ySmxOWi9IdlVaVk9TQ3YreCtTL0tPMkZXVC94UEUvYVJiTEtzQmtGaWQ3MlI0bUVQUFluZUhqQlMvYkdrUmdJL0pRNE5oSUNIQ3ZzcmNDSC9WdVErdUprcnNZNS9hbDRhdTRtNmhPRUtEazdNSThRblBaRit2b3ZIV0JEaTgxZDFzOHhDcHZZZ3A3Z3UzTm53SDVoVEM4Z2F6NDVNQVRxdnpybGUwd3ZTU2dsTEhqNjcvMk9VRDllZ1Yra1QyYWJLTVFHZkZQZUI5WHdHbXlwY2lCYXEvTk5Vc1hmNUVzVjgxSG5peExPdTBtWEVzQUkwV2htTjVRZHZkVmVwZGdzcmpTVW42Tk9qUklCZGxTQlJlbkNLcEJMQXdYVWRkNlVSQ1F5R2luV1dxZ2xwQ1FibFpUYitSUTloU0FXKzJaVEFtdnNxbmxRd1lSQU9DSU12RWJITUI1VktwVkRsYWFZSnRCWnB0Sk84MTNRbWlPUzNOdXJHelp5dEpzcDY5Qmx1N284ZE14UTh5djRLOTM4N1d0Qlg5TlJhVmwyTlNLUlVsbnR4UDIzbFpJbjhOOWRoa1Z5UmlXZmJsUXNDeDEyNDhWcnNlNnVlWVJzR2twWmo3VTRvMWpxOHRkckVkRC9VWkpwblE9In0=';
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
      try {
        GLOBAL_DECRYPTED_DATA = JSON.parse(decrypted);
      } catch (e) {
        console.error(e);
      }
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
      try {
        GLOBAL_DECRYPTED_DATA = JSON.parse(decrypted);
      } catch (e) {
        console.error(e);
      }
      localStorage.setItem('ariaccesskey', key);
      document.getElementById('pwd-forgotten-form').style.display = 'none';
      document.getElementById('recovery-form').style.display = 'block';
      await fillChat();
    }
  });
  
  document.getElementById('recovery-form').addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById('recovery-form').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
  });

  document.getElementById('profile-btn').addEventListener('click', () => {
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('profile-form').style.display = 'block';
  });

  document.getElementById('file-btn').addEventListener('click', () => {
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('chat-messages').style.display = 'flex';
  });

  document.getElementById('portable-btn').addEventListener('click', () => {
    window.open("scan/pair.html", "_blank");
  });

  document.getElementById('archive-btn').addEventListener('click', () => {
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('access-denied-form').style.display = 'block';
  });

  document.getElementById('access-denied-form').addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById('access-denied-form').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
  });

  document.getElementById('profile-form').addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById('profile-form').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
  });

  for (const btn of document.getElementsByClassName('back-to-dashboard')) {
    addBackToDBClickListener(btn);
  }

  await fillChat();
}

function addBackToDBClickListener(btn) {
  btn.addEventListener('click', () => {
    document.getElementById('chat-messages').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
  });
}

async function fillChat() {
  const defaultData = {
    chat: [
      {
        type: 'others',
        time: '12 Oct 24, 13:14',
        content: 'This is your assignment',
        attachment: ['Assignment', 'XXX.pdf']
      },
      {
        type: 'self',
        time: '12 Oct 24, 13:17',
        content: 'Thanks, I\'ll look into it'
      },
      {
        type: 'self',
        time: '12 Oct 24, 13:19',
        content: 'Livestream ended at 12 Oct 24, 13:20. Replay:',
        video: 'XXX.mp4'
      }
    ]
  };

  // console.log(JSON.stringify(defaultData));

  if (GLOBAL_DECRYPTED_DATA !== null && typeof GLOBAL_DECRYPTED_DATA.name === 'string')
    document.getElementById('profile-name').textContent = GLOBAL_DECRYPTED_DATA.name;
  if (GLOBAL_DECRYPTED_DATA !== null && typeof GLOBAL_DECRYPTED_DATA.birth === 'string')
    document.getElementById('profile-birth').textContent = GLOBAL_DECRYPTED_DATA.birth;
  if (GLOBAL_DECRYPTED_DATA !== null && typeof GLOBAL_DECRYPTED_DATA.street === 'string')
    document.getElementById('profile-street').textContent = GLOBAL_DECRYPTED_DATA.street;
  if (GLOBAL_DECRYPTED_DATA !== null && typeof GLOBAL_DECRYPTED_DATA.city === 'string')
    document.getElementById('profile-city').textContent = GLOBAL_DECRYPTED_DATA.city;
  if (GLOBAL_DECRYPTED_DATA !== null && typeof GLOBAL_DECRYPTED_DATA.id === 'string')
    document.getElementById('profile-id').textContent = GLOBAL_DECRYPTED_DATA.id;

  const chatHistory = (GLOBAL_DECRYPTED_DATA !== null && Array.isArray(GLOBAL_DECRYPTED_DATA.chat)) ? GLOBAL_DECRYPTED_DATA.chat : defaultData.chat;

  const btndiv1 = document.createElement('div');
  btndiv1.classList.add('message-button');
  const btn1 = document.createElement('button');
  btn1.classList.add('back-to-dashboard');
  btn1.textContent = 'BACK TO DASHBOARD';
  addBackToDBClickListener(btn1);
  btndiv1.appendChild(btn1);
  const btndiv2 = document.createElement('div');
  btndiv2.classList.add('message-button');
  const btn2 = document.createElement('button');
  btn2.classList.add('back-to-dashboard');
  btn2.textContent = 'BACK TO DASHBOARD';
  addBackToDBClickListener(btn2);
  btndiv2.appendChild(btn2);

  const messageDivs = [];
  for (const msg of chatHistory) {
    const div = document.createElement('div');
    div.classList.add(`message-${msg['type']}`);
    const timeSpan = document.createElement('span');
    timeSpan.classList.add('date');
    timeSpan.textContent = msg['time'];
    div.appendChild(timeSpan);
    const contentSpan = document.createElement('span');
    contentSpan.classList.add('content');
    contentSpan.innerHTML = msg['content'];
    if (typeof msg['video'] === 'string') {
      const video = document.createElement('video');
      video.controls = true;
      video.playsInline = true;
      if (GLOBAL_ACCESS_KEY !== null && msg['video'].slice(-7) === '.pcrypt') {
        try {
          const response = await fetch(msg['video']);
          if (!response.ok) {
            contentSpan.innerHTML += '<br />Could not load video.';
          } else {
            const encryptedBytes = await response.arrayBuffer();
            const result = await PuzzleCrypto.decryptBytes(GLOBAL_ACCESS_KEY, encryptedBytes);
            if (result === null) {
              contentSpan.innerHTML += '<br />Could not load video.';
            } else {
              const videoBlob = new Blob(
                [result.bytes],
                {
                  type: result.metadata.originalType || "video/mp4"
                }
              );
              if (video.dataset.objectUrl) {
                URL.revokeObjectURL(video.dataset.objectUrl);
              }
              const objectUrl = URL.createObjectURL(videoBlob);
              video.src = objectUrl;
              video.dataset.objectUrl = objectUrl;
              contentSpan.appendChild(document.createElement('br'));
              contentSpan.appendChild(video);
            }
          }
        } catch (error) {
          console.error(error);
          contentSpan.innerHTML += '<br />Could not load video.';
        }
      } else {
        video.src = msg['video'];
        contentSpan.appendChild(document.createElement('br'));
        contentSpan.appendChild(video);
      }
    }
    div.appendChild(contentSpan);
    if (Array.isArray(msg['attachment']) && msg['attachment'].length >= 2 && typeof msg['attachment'][0] === 'string'
        && typeof msg['attachment'][1] === 'string') {
      const attachmentSpan = document.createElement('span');
      attachmentSpan.classList.add('attachments');
      const link = document.createElement('a');
      link.textContent = msg['attachment'][0];
      if (GLOBAL_ACCESS_KEY !== null && msg['attachment'][1].slice(-7) === '.pcrypt') {
        try {
          const response = await fetch(msg['attachment'][1]);
          if (!response.ok) {
            link.textContent = 'Could not load attachment';
            link.href = msg['attachment'][1];
          } else {
            const encryptedBytes = await response.arrayBuffer();
            const result = await PuzzleCrypto.decryptBytes(GLOBAL_ACCESS_KEY, encryptedBytes);
            if (result === null) {
              link.textContent = 'Could not load attachment';
              link.href = msg['attachment'][1];
            } else {
              const pdfBlob = new Blob(
                [result.bytes],
                {
                  type: result.metadata.originalType || "application/pdf"
                }
              );
              if (link.dataset.objectUrl) {
                URL.revokeObjectURL(link.dataset.objectUrl);
              }
              const objectUrl = URL.createObjectURL(pdfBlob);
              link.href = objectUrl;
              link.dataset.objectUrl = objectUrl;
            }
          }
        } catch (error) {
          console.error(error);
          link.textContent = 'Could not load attachment';
          link.href = msg['attachment'][1];
        }
      } else {
        link.href = msg['attachment'][1];
      }
      link.target = '_blank';
      attachmentSpan.appendChild(link);
      div.appendChild(attachmentSpan);
    }
    messageDivs.push(div);
  }

  document.getElementById('chat-messages').replaceChildren(btndiv1, ...messageDivs, btndiv2);
}
