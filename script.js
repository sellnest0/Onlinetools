/* ==========================================
   GLOBAL VARIABLES & STATE
   ========================================== */
   let activeInterval = null;
   const workspace = document.getElementById('tool-container');
   const emptyState = document.querySelector('.empty-state');
   
   /* ==========================================
      THEME & NAVIGATION & MODALS
      ========================================== */
   
   // Dark Mode Toggle
   const themeBtn = document.getElementById('theme-toggle');
   const icon = themeBtn.querySelector('i');
   
   // Check saved theme
   if (localStorage.getItem('theme') === 'dark') {
       document.body.classList.add('dark-mode');
       icon.classList.replace('fa-moon', 'fa-sun');
   }
   
   themeBtn.addEventListener('click', () => {
       document.body.classList.toggle('dark-mode');
       if (document.body.classList.contains('dark-mode')) {
           localStorage.setItem('theme', 'dark');
           icon.classList.replace('fa-moon', 'fa-sun');
       } else {
           localStorage.setItem('theme', 'light');
           icon.classList.replace('fa-sun', 'fa-moon');
       }
   });
   
   // Mobile Menu Toggle
   document.getElementById('hamburger').addEventListener('click', () => {
       document.getElementById('navMenu').classList.toggle('active');
   });
   
   // Close Mobile Menu when clicking a link
   document.querySelectorAll('.nav-menu a').forEach(link => {
       link.addEventListener('click', () => {
           document.getElementById('navMenu').classList.remove('active');
       });
   });
   
   // Modal System
   function openModal(type) {
       const overlay = document.getElementById('modal-overlay');
       const title = document.getElementById('modal-title');
       const body = document.getElementById('modal-body');
   
       overlay.style.display = 'flex';
   
       if (type === 'about') {
           title.innerText = "About Us";
           body.innerHTML = `
               <p>Welcome to <strong>ToolTreasure Hub</strong>.</p>
               <p>We provide a collection of free, fast, and privacy-focused tools for everyday use.</p>
               <p style="margin-top:10px">All calculations and image processing happen <strong>locally on your device</strong>. No data is ever sent to our servers.</p>
           `;
       } else if (type === 'privacy') {
           title.innerText = "Privacy Policy";
           body.innerHTML = `
               <p><strong>Your Privacy Matters.</strong></p>
               <ul style="margin-left:20px; margin-top:10px; list-style:disc">
                   <li>We do not store any photos you process.</li>
                   <li>We do not track personal input data.</li>
                   <li>We use standard local storage for settings (like Dark Mode).</li>
               </ul>
           `;
       }
   }
   
   function closeModal() {
       document.getElementById('modal-overlay').style.display = 'none';
   }
   
   document.getElementById('modal-overlay').addEventListener('click', (e) => {
       if (e.target.id === 'modal-overlay') closeModal();
   });
   
   /* ==========================================
      TOOL SELECTION LOGIC
      ========================================== */
   
   // Accordion Logic
   const accordionHeaders = document.querySelectorAll('.accordion-header');
   accordionHeaders.forEach(header => {
       header.addEventListener('click', () => {
           const body = header.nextElementSibling;
           body.classList.toggle('active');
           // Optional: Rotate icon
           // const i = header.querySelector('i');
           // i.style.transform = body.classList.contains('active') ? 'rotate(90deg)' : 'rotate(0deg)';
       });
   });
   
   // Tool Button Logic
   const toolBtns = document.querySelectorAll('.tool-btn');
   toolBtns.forEach(btn => {
       btn.addEventListener('click', function() {
           // Reset UI highlights
           toolBtns.forEach(b => b.style.color = 'var(--text-sec)');
           this.style.color = 'var(--primary)';
           
           // Clear Timers from previous tools
           if (activeInterval) {
               clearInterval(activeInterval);
               activeInterval = null;
           }
           
           // Load Tool
           const toolId = this.getAttribute('data-tool');
           loadTool(toolId);
           
           // Mobile Auto-Scroll to workspace
           if(window.innerWidth < 768) {
               document.getElementById('workspace').scrollIntoView({behavior:'smooth', block: 'start'});
           }
       });
   });
   
   /* ==========================================
      TOOL RENDERING ENGINE
      ========================================== */
   function loadTool(toolId) {
       emptyState.style.display = 'none';
       let html = '';
   
       switch(toolId) {
           /* --- CALCULATORS --- */
           case 'calc-basic':
               html = `
                   <h2 class="tool-title">Basic Calculator</h2>
                   <div style="max-width:300px; margin:0 auto;">
                       <input type="text" id="calc-display" readonly style="text-align:right; margin-bottom:10px; font-size:1.5rem; font-weight:bold">
                       <div class="calc-grid">
                           <button class="calc-btn" onclick="appendCalc('7')">7</button><button class="calc-btn" onclick="appendCalc('8')">8</button><button class="calc-btn" onclick="appendCalc('9')">9</button><button class="calc-btn op" onclick="appendCalc('/')">/</button>
                           <button class="calc-btn" onclick="appendCalc('4')">4</button><button class="calc-btn" onclick="appendCalc('5')">5</button><button class="calc-btn" onclick="appendCalc('6')">6</button><button class="calc-btn op" onclick="appendCalc('*')">*</button>
                           <button class="calc-btn" onclick="appendCalc('1')">1</button><button class="calc-btn" onclick="appendCalc('2')">2</button><button class="calc-btn" onclick="appendCalc('3')">3</button><button class="calc-btn op" onclick="appendCalc('-')">-</button>
                           <button class="calc-btn" onclick="appendCalc('0')">0</button><button class="calc-btn" onclick="appendCalc('.')">.</button><button class="calc-btn" onclick="document.getElementById('calc-display').value=''">C</button><button class="calc-btn op" onclick="appendCalc('+')">+</button>
                           <button class="calc-btn eq" onclick="solveCalc()">=</button>
                       </div>
                   </div>`;
               workspace.innerHTML = html;
               break;
   
           case 'calc-bmi':
               html = `
                   <h2 class="tool-title">BMI Calculator</h2>
                   <div class="tool-group"><label>Weight (kg)</label><input type="number" id="bmi-w" placeholder="e.g. 70"></div>
                   <div class="tool-group"><label>Height (cm)</label><input type="number" id="bmi-h" placeholder="e.g. 175"></div>
                   <button class="action-btn" onclick="calculateBMI()">Calculate</button>
                   <div id="bmi-result" class="result-box" style="display:none"></div>`;
               workspace.innerHTML = html;
               break;
           
           case 'calc-sci':
               html = `<h2 class="tool-title">Scientific Calculator</h2>
               <div class="tool-group">
                   <input type="text" id="sci-display" placeholder="e.g. Math.sin(30) or 5*5" style="font-family:monospace">
                   <small style="color:var(--text-sec)">Use JS Math syntax: Math.sqrt(25), Math.pow(2,3)</small>
               </div>
               <button class="action-btn" onclick="solveSci()">Calculate</button>
               <div id="sci-out" class="result-box">Result will appear here</div>`;
               workspace.innerHTML = html;
               break;
   
           case 'calc-age':
               html = `<h2 class="tool-title">Age Calculator</h2>
               <div class="tool-group"><label>Date of Birth</label><input type="date" id="dob"></div>
               <button class="action-btn" onclick="calculateAge()">Calculate Age</button>
               <div id="age-result" class="result-box" style="display:none"></div>`;
               workspace.innerHTML = html;
               break;
   
            case 'calc-loan':
                html = `<h2 class="tool-title">Loan Calculator</h2>
                <div class="tool-group"><label>Loan Amount ($)</label><input type="number" id="loan-amt" placeholder="10000"></div>
                <div class="tool-group"><label>Annual Interest Rate (%)</label><input type="number" id="loan-rate" placeholder="5.5"></div>
                <div class="tool-group"><label>Loan Term (Months)</label><input type="number" id="loan-months" placeholder="12"></div>
                <button class="action-btn" onclick="calculateLoan()">Calculate Payment</button>
                <div id="loan-result" class="result-box" style="display:none"></div>`;
                workspace.innerHTML = html;
                break;
   
           /* --- CONVERTERS --- */
           case 'conv-curr':
               html = `<h2 class="tool-title">Currency Converter</h2>
               <div class="tool-group"><label>Amount (USD)</label><input type="number" id="curr-amt" value="1"></div>
               <button class="action-btn" onclick="convertCurrency()">Convert</button>
               <div id="curr-res" class="result-box"></div>`;
               workspace.innerHTML = html;
               break;
   
           case 'conv-len':
               html = `<h2 class="tool-title">Length Converter</h2>
               <div class="tool-group"><label>Meters</label><input type="number" id="conv-m" oninput="document.getElementById('conv-f').value=(this.value*3.28084).toFixed(3)"></div>
               <div class="tool-group"><label>Feet</label><input type="number" id="conv-f" oninput="document.getElementById('conv-m').value=(this.value/3.28084).toFixed(3)"></div>`;
               workspace.innerHTML = html;
               break;
               
           case 'conv-wgt':
               html = `<h2 class="tool-title">Weight Converter</h2>
               <div class="tool-group"><label>Kilograms</label><input type="number" id="w-kg" oninput="document.getElementById('w-lb').value=(this.value*2.20462).toFixed(2)"></div>
               <div class="tool-group"><label>Pounds</label><input type="number" id="w-lb" oninput="document.getElementById('w-kg').value=(this.value/2.20462).toFixed(2)"></div>`;
               workspace.innerHTML = html;
               break;

           case 'conv-temp':
               html = `<h2 class="tool-title">Temperature Converter</h2>
               <div class="tool-group"><label>Celsius</label><input type="number" id="t-c" oninput="document.getElementById('t-f').value=(this.value*9/5+32).toFixed(1)"></div>
               <div class="tool-group"><label>Fahrenheit</label><input type="number" id="t-f" oninput="document.getElementById('t-c').value=((this.value-32)*5/9).toFixed(1)"></div>`;
               workspace.innerHTML = html;
               break;
   
           /* --- DATE & TIME --- */
           case 'time-world':
               html = `<h2 class="tool-title">World Clock</h2><div class="clock-grid" id="clock-container"></div>`;
               workspace.innerHTML = html;
               initWorldClock();
               break;
   
           case 'time-count':
               html = `<h2 class="tool-title">Countdown Timer</h2>
               <div class="tool-group"><label>Seconds</label><input type="number" id="cd-sec" value="60"></div>
               <button class="action-btn" onclick="startCountdown()">Start</button>
               <div id="cd-display" style="font-size:3rem; text-align:center; margin-top:20px; color:var(--primary)">00:00</div>`;
               workspace.innerHTML = html;
               break;
           
           case 'time-sleep':
               html = `<h2 class="tool-title">Meditation Timer</h2>
               <button class="action-btn" onclick="startMeditation(5)">5 Min</button>
               <button class="action-btn" onclick="startMeditation(10)">10 Min</button>
               <div id="med-disp" style="font-size:2rem; margin-top:20px;">Ready?</div>`;
               workspace.innerHTML = html;
               break;
   
           /* --- GENERATORS --- */
           case 'gen-pass':
               html = `<h2 class="tool-title">Password Generator</h2>
               <div class="tool-group"><label>Length</label><input type="number" id="pass-len" value="12" max="50"></div>
               <button class="action-btn" onclick="generatePass()">Generate</button>
               <input type="text" id="pass-out" class="result-box" readonly style="margin-top:10px">`;
               workspace.innerHTML = html;
               break;
   
           case 'gen-qr':
               html = `<h2 class="tool-title">QR Code Generator</h2>
               <div class="tool-group"><input type="text" id="qr-text" placeholder="Enter URL or Text"></div>
               <button class="action-btn" onclick="generateQR()">Generate</button>
               <div style="text-align:center; margin-top:20px; background:#fff; padding:10px; border-radius:8px; display:inline-block;"><canvas id="qr-canvas"></canvas></div>`;
               workspace.innerHTML = html;
               break;
           
           case 'gen-rnd':
               html = `<h2 class="tool-title">Random Number</h2>
               <div style="display:flex; gap:10px">
                <input type="number" id="rnd-min" placeholder="Min" value="1">
                <input type="number" id="rnd-max" placeholder="Max" value="100">
               </div>
               <button class="action-btn" onclick="generateRandom()">Roll</button>
               <div id="rnd-res" class="result-box" style="font-size:2rem; text-align:center">0</div>`;
               workspace.innerHTML = html;
               break;
   
           case 'gen-lorem':
               html = `<h2 class="tool-title">Lorem Ipsum Generator</h2>
               <button class="action-btn" onclick="generateLorem()">Generate Text</button>
               <div id="lorem-out" class="result-box"></div>`;
               workspace.innerHTML = html;
               break;
   
           /* --- TEXT TOOLS --- */
           case 'txt-count':
               html = `<h2 class="tool-title">Word Counter</h2>
               <textarea id="txt-in" rows="8" placeholder="Type here..." oninput="countWords()"></textarea>
               <div id="txt-stats" class="result-box">Words: 0 | Characters: 0</div>`;
               workspace.innerHTML = html;
               break;
           
           case 'txt-rev':
               html = `<h2 class="tool-title">Reverse Text</h2>
               <textarea id="rev-in" rows="4"></textarea>
               <button class="action-btn" onclick="document.getElementById('rev-out').value = document.getElementById('rev-in').value.split('').reverse().join('')">Reverse</button>
               <textarea id="rev-out" rows="4" readonly style="margin-top:10px"></textarea>`;
               workspace.innerHTML = html;
               break;

           case 'txt-case':
                html = `<h2 class="tool-title">Case Converter</h2>
                <textarea id="case-in" rows="5"></textarea>
                <button class="action-btn" onclick="document.getElementById('case-in').value = document.getElementById('case-in').value.toUpperCase()">UPPER CASE</button>
                <button class="action-btn" onclick="document.getElementById('case-in').value = document.getElementById('case-in').value.toLowerCase()">lower case</button>`;
                workspace.innerHTML = html;
                break;

           case 'txt-minify':
               html = `<h2 class="tool-title">JS/CSS Minifier (Basic)</h2>
               <textarea id="min-in" rows="8" placeholder="Paste Code"></textarea>
               <button class="action-btn" onclick="minifyCode()">Minify</button>
               <textarea id="min-out" rows="8" readonly style="margin-top:10px"></textarea>`;
               workspace.innerHTML = html;
               break;
   
           /* --- IMAGE TOOLS --- */
           case 'img-compress':
               html = `<h2 class="tool-title">Image Compressor</h2>
               <div class="drop-zone" onclick="document.getElementById('img-up').click()">
                   <p>Click to Upload Image</p>
                   <input type="file" id="img-up" hidden accept="image/*">
               </div>
               <div class="tool-group" style="margin-top:15px">
                   <label>Compression Quality (0.1 - 1.0)</label>
                   <input type="range" id="img-qual" min="0.1" max="0.9" step="0.1" value="0.6">
               </div>
               <img id="preview-img">
               <br>
               <button class="action-btn" id="dl-btn" style="display:none" onclick="downloadCompressed()">Download Result</button>`;
               workspace.innerHTML = html;
               initImageCompressor();
               break;

           case 'img-base64':
               html = `<h2 class="tool-title">Image to Base64</h2>
               <input type="file" onchange="imgToBase64(this)">
               <textarea id="b64-out" rows="8" style="margin-top:10px" placeholder="Base64 string will appear here"></textarea>`;
               workspace.innerHTML = html;
               break;

           case 'img-pdf':
               html = `<h2 class="tool-title">Image to PDF</h2>
               <p>Convert JPG/PNG to PDF instantly.</p>
               <input type="file" id="pdf-img-in" accept="image/*">
               <button class="action-btn" onclick="convertImgToPDF()">Download PDF</button>`;
               workspace.innerHTML = html;
               break;

           case 'img-resize':
               html = `<h2 class="tool-title">Image Resizer</h2>
               <input type="file" id="resize-in" accept="image/*">
               <div class="tool-group" style="margin-top:10px; display:flex; gap:10px">
                   <input type="number" id="resize-w" placeholder="Width (px)">
                   <input type="number" id="resize-h" placeholder="Height (px)">
               </div>
               <button class="action-btn" onclick="resizeImage()">Resize & Download</button>
               <canvas id="resize-canvas" style="display:none"></canvas>`;
               workspace.innerHTML = html;
               break;
   
           /* --- PRODUCTIVITY --- */
           case 'prod-todo':
               html = `<h2 class="tool-title">Checklist</h2>
               <div style="display:flex; gap:10px"><input type="text" id="todo-in" placeholder="Add new item"><button class="action-btn" onclick="addTodo()">Add</button></div>
               <ul id="todo-list" style="margin-top:20px; list-style:none;"></ul>`;
               workspace.innerHTML = html;
               loadTodos();
               break;

           case 'prod-notes':
               html = `<h2 class="tool-title">Notepad (Auto-Save)</h2>
               <textarea id="notepad" rows="15" style="padding:15px; border:1px solid var(--border);" oninput="localStorage.setItem('myNotes', this.value)">${localStorage.getItem('myNotes') || ''}</textarea>`;
               workspace.innerHTML = html;
               break;

           case 'prod-res':
               html = `<h2 class="tool-title">Screen Resolution</h2>
               <div class="result-box" style="text-align:center; font-size:2rem">
               ${window.screen.width} x ${window.screen.height}
               </div>
               <p style="text-align:center">Window Viewport: ${window.innerWidth} x ${window.innerHeight}</p>`;
               workspace.innerHTML = html;
               break;

           case 'prod-pomo':
               html = `<h2 class="tool-title">Pomodoro Timer</h2>
               <div id="pomo-timer" style="font-size:4rem; text-align:center; font-weight:bold; color:var(--primary)">25:00</div>
               <div style="text-align:center; margin-top:20px">
                   <button class="action-btn" onclick="startPomo(25)">Work</button>
                   <button class="action-btn" onclick="startPomo(5)">Break</button>
                   <button class="action-btn" onclick="clearInterval(activeInterval); document.getElementById('pomo-timer').innerText='00:00'">Stop</button>
               </div>`;
               workspace.innerHTML = html;
               break;

           case 'prod-type':
               html = `<h2 class="tool-title">Typing Speed Test</h2>
               <div id="type-area" style="background:var(--bg-input); color:var(--text-main); padding:15px; border-radius:5px; margin-bottom:10px; line-height:1.6; border:1px solid var(--border);"></div>
               <textarea id="type-input" rows="3" placeholder="Start typing the text above..." disabled></textarea>
               <button class="action-btn" id="start-type-btn" onclick="startTypingTest()">Start Test</button>
               <div id="type-res" class="result-box" style="display:none"></div>`;
               workspace.innerHTML = html;
               break;

           /* --- FUN --- */
           case 'fun-joke':
               const jokes = [
                   "Why do programmers prefer dark mode? Because light attracts bugs.",
                   "I tried to catch some fog earlier. I mist.",
                   "I told my wife she was drawing her eyebrows too high. She looked surprised.",
                   "Why did the scarecrow win an award? He was outstanding in his field."
               ];
               html = `<h2 class="tool-title">Random Joke</h2>
               <p class="result-box" style="font-size:1.2rem">${jokes[Math.floor(Math.random()*jokes.length)]}</p>
               <button class="action-btn" onclick="loadTool('fun-joke')">Next Joke</button>`;
               workspace.innerHTML = html;
               break;

           case 'fun-quote':
               const quotes = [
                   "The only way to do great work is to love what you do.",
                   "Simplicity is the ultimate sophistication.",
                   "Code is like humor. When you have to explain it, it’s bad."
               ];
               html = `<h2 class="tool-title">Random Quote</h2>
               <blockquote class="result-box" style="font-style:italic">"${quotes[Math.floor(Math.random()*quotes.length)]}"</blockquote>
               <button class="action-btn" onclick="loadTool('fun-quote')">Next Quote</button>`;
               workspace.innerHTML = html;
               break;
       }
   }
   
   /* ==========================================
      TOOL FUNCTIONALITY
      ========================================== */
   
   // 1. Calculators
   function appendCalc(val) {
       document.getElementById('calc-display').value += val;
   }
   function solveCalc() {
       try { document.getElementById('calc-display').value = eval(document.getElementById('calc-display').value); }
       catch { alert('Invalid Expression'); }
   }
   function solveSci() {
       try { document.getElementById('sci-out').innerText = eval(document.getElementById('sci-display').value); }
       catch { document.getElementById('sci-out').innerText = 'Error'; }
   }
   function calculateBMI() {
       const w = parseFloat(document.getElementById('bmi-w').value);
       const h = parseFloat(document.getElementById('bmi-h').value) / 100;
       if(w && h) {
           const bmi = (w/(h*h)).toFixed(2);
           const res = document.getElementById('bmi-result');
           res.style.display = 'block';
           res.innerHTML = `Your BMI is <strong>${bmi}</strong>`;
       }
   }
   function calculateAge() {
       const dob = new Date(document.getElementById('dob').value);
       if(!isNaN(dob)) {
           const diff = Date.now() - dob.getTime();
           const age = new Date(diff).getUTCFullYear() - 1970;
           document.getElementById('age-result').style.display = 'block';
           document.getElementById('age-result').innerText = `You are ${age} years old.`;
       }
   }
   function calculateLoan() {
       const p = parseFloat(document.getElementById('loan-amt').value);
       const r = parseFloat(document.getElementById('loan-rate').value) / 100 / 12;
       const n = parseFloat(document.getElementById('loan-months').value);
       if(p && r && n) {
           const m = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
           document.getElementById('loan-result').style.display = 'block';
           document.getElementById('loan-result').innerText = `Monthly Payment: $${m.toFixed(2)}`;
       }
   }
   
   // 2. Converters
   function convertCurrency() {
       const amt = document.getElementById('curr-amt').value;
       // Hardcoded typical rates
       document.getElementById('curr-res').innerHTML = `
       ${amt} USD = ${(amt*0.92).toFixed(2)} EUR<br>
       ${amt} USD = ${(amt*110.00).toFixed(2)} BDT<br>
       ${amt} USD = ${(amt*83.00).toFixed(2)} INR
       `;
   }
   
   // 3. World Clock
   function initWorldClock() {
       const cities = [
           {name:'Dhaka', tz:'Asia/Dhaka'}, {name:'New York', tz:'America/New_York'},
           {name:'London', tz:'Europe/London'}, {name:'Tokyo', tz:'Asia/Tokyo'},
           {name:'Dubai', tz:'Asia/Dubai'}, {name:'Sydney', tz:'Australia/Sydney'},
           {name:'Paris', tz:'Europe/Paris'}, {name:'Berlin', tz:'Europe/Berlin'},
           {name:'Singapore', tz:'Asia/Singapore'}, {name:'Toronto', tz:'America/Toronto'},
           {name:'Beijing', tz:'Asia/Shanghai'}, {name:'Mumbai', tz:'Asia/Kolkata'},
           {name:'Cairo', tz:'Africa/Cairo'}, {name:'Riyadh', tz:'Asia/Riyadh'},
           {name:'Jakarta', tz:'Asia/Jakarta'}, {name:'Seoul', tz:'Asia/Seoul'},
           {name:'Bangkok', tz:'Asia/Bangkok'}, {name:'Istanbul', tz:'Europe/Istanbul'},
           {name:'Mexico City', tz:'America/Mexico_City'}, {name:'São Paulo', tz:'America/Sao_Paulo'},
           {name:'Karachi', tz:'Asia/Karachi'}, {name:'Hong Kong', tz:'Asia/Hong_Kong'},
           {name:'Rome', tz:'Europe/Rome'}, {name:'Delhi', tz:'Asia/Kolkata'}
       ];
   
       const container = document.getElementById('clock-container');
       
       function updateTimes() {
           if(!document.getElementById('clock-container')) return;
           container.innerHTML = '';
           const now = new Date();
           cities.forEach(c => {
               const time = now.toLocaleTimeString('en-US', {timeZone: c.tz, hour12: true, hour: '2-digit', minute:'2-digit'});
               container.innerHTML += `
               <div class="city-card">
                   <div class="city-time">${time}</div>
                   <div class="city-name">${c.name}</div>
               </div>`;
           });
       }
       updateTimes();
       activeInterval = setInterval(updateTimes, 1000);
   }
   
   function startCountdown() {
       if(activeInterval) clearInterval(activeInterval);
       let s = parseInt(document.getElementById('cd-sec').value);
       activeInterval = setInterval(() => {
           document.getElementById('cd-display').innerText = s;
           if(s <= 0) { clearInterval(activeInterval); alert("Time's up!"); }
           s--;
       }, 1000);
   }

   function startMeditation(min) {
       if(activeInterval) clearInterval(activeInterval);
       let s = min * 60;
       document.getElementById('med-disp').innerText = "Breathe In... Breathe Out...";
       activeInterval = setInterval(() => {
           let m = Math.floor(s/60);
           let sc = s%60;
           document.getElementById('med-disp').innerText = `${m}:${sc<10?'0'+sc:sc}`;
           if(s<=0) { clearInterval(activeInterval); document.getElementById('med-disp').innerText="Session Complete"; }
           s--;
       }, 1000);
   }
   
   // 4. Generators
   function generatePass() {
       const len = document.getElementById('pass-len').value;
       const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
       let pass = "";
       for(let i=0;i<len;i++) pass += chars.charAt(Math.floor(Math.random()*chars.length));
       document.getElementById('pass-out').value = pass;
   }
   function generateQR() {
       const txt = document.getElementById('qr-text').value;
       if(txt) new QRious({element: document.getElementById('qr-canvas'), value: txt, size: 200});
   }
   function generateRandom() {
       const min = parseInt(document.getElementById('rnd-min').value);
       const max = parseInt(document.getElementById('rnd-max').value);
       document.getElementById('rnd-res').innerText = Math.floor(Math.random() * (max - min + 1) + min);
   }
   function generateLorem() {
       document.getElementById('lorem-out').innerText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.";
   }
   
   // 5. Text Tools
   function countWords() {
       const txt = document.getElementById('txt-in').value;
       const w = txt.trim().split(/\s+/).filter(x=>x).length;
       document.getElementById('txt-stats').innerText = `Words: ${w} | Characters: ${txt.length}`;
   }
   function minifyCode() {
       let c = document.getElementById('min-in').value;
       c = c.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g,'').replace(/\s+/g,' '); // Simple Regex Minify
       document.getElementById('min-out').value = c.trim();
   }
   
   // 6. Image Tools
   let originalImage = null;
   function initImageCompressor() {
       document.getElementById('img-up').addEventListener('change', function(e) {
           if(e.target.files && e.target.files[0]) {
               const reader = new FileReader();
               reader.onload = function(ev) {
                   originalImage = new Image();
                   originalImage.src = ev.target.result;
                   originalImage.onload = function() {
                       document.getElementById('preview-img').src = originalImage.src;
                       document.getElementById('preview-img').style.display = 'block';
                       document.getElementById('dl-btn').style.display = 'inline-block';
                   }
               }
               reader.readAsDataURL(e.target.files[0]);
           }
       });
   }
   function downloadCompressed() {
       if(!originalImage) return;
       const canvas = document.createElement('canvas');
       canvas.width = originalImage.width;
       canvas.height = originalImage.height;
       const ctx = canvas.getContext('2d');
       ctx.drawImage(originalImage, 0, 0);
       const q = parseFloat(document.getElementById('img-qual').value);
       const link = document.createElement('a');
       link.download = 'compressed.jpg';
       link.href = canvas.toDataURL('image/jpeg', q);
       link.click();
   }
   function imgToBase64(input) {
       if(input.files[0]) {
           const reader = new FileReader();
           reader.onload = (e) => document.getElementById('b64-out').value = e.target.result;
           reader.readAsDataURL(input.files[0]);
       }
   }
   function convertImgToPDF() {
       const input = document.getElementById('pdf-img-in');
       if(input.files[0]) {
           const reader = new FileReader();
           reader.onload = function(e) {
               const { jsPDF } = window.jspdf;
               const doc = new jsPDF();
               const imgData = e.target.result;
               const props = doc.getImageProperties(imgData);
               const pdfW = doc.internal.pageSize.getWidth();
               const pdfH = (props.height * pdfW) / props.width;
               doc.addImage(imgData, 'JPEG', 0, 0, pdfW, pdfH);
               doc.save("image.pdf");
           }
           reader.readAsDataURL(input.files[0]);
       } else { alert('Select an image first'); }
   }
   function resizeImage() {
       const input = document.getElementById('resize-in');
       const w = document.getElementById('resize-w').value;
       const h = document.getElementById('resize-h').value;
       if(input.files[0] && w && h) {
           const reader = new FileReader();
           reader.onload = function(e) {
               const img = new Image();
               img.onload = function() {
                   const cvs = document.getElementById('resize-canvas');
                   cvs.width = w; cvs.height = h;
                   cvs.getContext('2d').drawImage(img, 0, 0, w, h);
                   const a = document.createElement('a');
                   a.download = 'resized.jpg';
                   a.href = cvs.toDataURL('image/jpeg');
                   a.click();
               }
               img.src = e.target.result;
           }
           reader.readAsDataURL(input.files[0]);
       }
   }
   
   // 7. Productivity
   function loadTodos() {
       const list = document.getElementById('todo-list');
       const todos = JSON.parse(localStorage.getItem('todos') || '[]');
       list.innerHTML = todos.map((t,i) => `
           <li style="padding:5px; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; color:var(--text-main);">
               <span>${t}</span>
               <button onclick="removeTodo(${i})" style="color:red; background:none; border:none; cursor:pointer">x</button>
           </li>`).join('');
   }
   function addTodo() {
       const val = document.getElementById('todo-in').value;
       if(val) {
           const todos = JSON.parse(localStorage.getItem('todos') || '[]');
           todos.push(val);
           localStorage.setItem('todos', JSON.stringify(todos));
           document.getElementById('todo-in').value = '';
           loadTodos();
       }
   }
   function removeTodo(index) {
       const todos = JSON.parse(localStorage.getItem('todos') || '[]');
       todos.splice(index, 1);
       localStorage.setItem('todos', JSON.stringify(todos));
       loadTodos();
   }
   
   function startPomo(min) {
       if(activeInterval) clearInterval(activeInterval);
       let s = min * 60;
       activeInterval = setInterval(() => {
           let m = Math.floor(s/60);
           let sec = s%60;
           document.getElementById('pomo-timer').innerText = `${m}:${sec<10?'0'+sec:sec}`;
           if(s<=0) { clearInterval(activeInterval); alert('Session finished!'); }
           s--;
       }, 1000);
   }

   function startTypingTest() {
       const text = "The quick brown fox jumps over the lazy dog. Technology is best when it brings people together. Do not wait for the perfect moment, take the moment and make it perfect.";
       const area = document.getElementById('type-area');
       const input = document.getElementById('type-input');
       
       area.innerHTML = text;
       input.value = "";
       input.disabled = false;
       input.focus();
       document.getElementById('start-type-btn').style.display = 'none';
       document.getElementById('type-res').style.display = 'none';
       
       const startTime = new Date();
       
       input.addEventListener('input', function check() {
           if(input.value === text) {
               const time = (new Date() - startTime) / 1000 / 60;
               const wpm = Math.round((text.split(' ').length) / time);
               document.getElementById('type-res').style.display = 'block';
               document.getElementById('type-res').innerText = `Finished! Speed: ${wpm} WPM`;
               input.disabled = true;
               input.removeEventListener('input', check);
               document.getElementById('start-type-btn').style.display = 'inline-block';
               document.getElementById('start-type-btn').innerText = 'Retry';
           }
       });
   }