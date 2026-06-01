/**
 * 🤖 Conversational AI Assistant — Isolated Mobile Controller Script
 * Handles:
 * 1. 3-Stage Transition Sequence: Intro Splash -> Welcome Speech -> QA Stack -> Answer Cards
 * 2. Automatic 1.2s progressive fade-in of sugession chips (minimizing cognitive scanning overload)
 * 3. Native free client-side Web Speech API speechSynthesis loop
 * 4. Ergonomic thumb-reach capsule controls & email/call action deflect cards
 */

window.MobileAiAssistant = {
  container: null,
  siriOrb: null,
  orbCaption: null,
  backPill: null,
  screens: {
    intro: null,
    voice: null,
    chat: null
  },
  chatInput: null,
  chatSend: null,
  chatThread: null,
  chatInputWrapper: null,
  
  speechUtterance: null,
  isSpeaking: false,
  welcomePlayed: false,
  welcomeTimeout: null,
  
  // 🎙️ High-end Active Listening Web Audio & Animation states
  audioStream: null,
  audioContext: null,
  audioSource: null,
  audioAnalyser: null,
  audioDataArray: null,
  waveAnimationFrame: null,
  listeningTimeout: null,
  activeWordMap: [],

  // High-fidelity knowledge base mapping to suggestion chips
  knowledgeBase: {
    Professional: {
      title: "Professional Experience",
      text: "I bring over <span class='highlight-blue'>22 years of design experience</span>, including more than 9 years focused deeply on UX. I have shaped real products within real-world constraints across domains like B2B SaaS, Healthcare, Gaming, and Productivity. My philosophy is to balance business goals with absolute user dignity by combining behavioral insights and advanced AI-driven workflows.",
      speech: "I bring over 22 years of design experience, including more than 9 years focused deeply on UX. I have shaped real products within real-world constraints across domains like B2B SaaS, Healthcare, Gaming, and Productivity. My philosophy is to balance business goals with absolute user dignity by combining behavioral insights and advanced AI-driven workflows."
    },
    Educational: {
      title: "Education & Academy",
      text: "I hold a prestigious <span class='highlight-green'>Executive PG in UX from IIT Roorkee</span>. This structured academic grounding governs my approach to interaction models, design research ethics, cognitive psychology, and accessibility standard testing.",
      speech: "I hold a prestigious Executive PG in UX from IIT Roorkee. This structured academic grounding governs my approach to interaction models, design research ethics, cognitive psychology, and accessibility standard testing."
    },
    Personal: {
      title: "About Sayantan",
      text: "I believe that in the age of AI, designers must think beyond screens. I approach problems with deep curiosity, challenge raw assumptions, and create clean, structural experiences that simplify complexity. My focus is always on solving meaningful human problems.",
      speech: "I believe that in the age of AI, designers must think beyond screens. I approach problems with deep curiosity, challenge raw assumptions, and create clean, structural experiences that simplify complexity. My focus is always on solving meaningful human problems."
    },
    Skill: {
      title: "Tools & Core Skills",
      text: "My technical stack includes <span class='highlight-blue'>Framer, Figma, Miro, Claude, Gemini, and Antigravity</span>. I specialize in advanced interaction design (IxDF certified), contextual research, affinity mapping, user personas, and high-fidelity responsive prototyping.",
      speech: "My stack includes Framer, Figma, Miro, Claude, Gemini, and Antigravity. I specialize in advanced interaction design, contextual research, affinity mapping, user personas, and high-fidelity responsive prototyping."
    },
    Thinking: {
      title: "UX Thinking Process",
      text: "My process starts by investigating <span class='highlight-green'>'quiet failures'</span>—things humans adapt to without questioning (like price stickers or capacitive door handles). I run active and passive contextual interviews to observe users in the moment, rather than relying on reconstructed memories, clustering observations into actionable affinity matrices.",
      speech: "My process starts by investigating 'quiet failures'—things humans adapt to without questioning. I run active and passive contextual interviews to observe users in the moment, rather than relying on reconstructed memories, clustering observations into actionable affinity matrices."
    },
    Projects: {
      title: "Featured Case Study",
      text: "My featured project is <span class='highlight-blue'>Tracto</span>: an eldercare healthcare ecosystem. By mapping chronic health needs and emotional independence, I designed a silent, passive monitoring app that restored elder freedom and caregiver peace of mind without constant, anxious check-in calls.",
      speech: "My featured project is Tracto: an eldercare healthcare ecosystem. By mapping chronic health needs and emotional independence, I designed a silent, passive monitoring app that restored elder freedom and caregiver peace of mind without constant, anxious check-in calls."
    },
    Communication: {
      title: "Get In Touch",
      text: "I am ready for strategic new opportunities! You can <span class='highlight-blue'>call me directly at +91 995 962 9041</span> or email me at <span class='highlight-green'>myprofile.sayantan@gmail.com</span>. Tapping the action buttons below will connect you with me instantly!",
      speech: "I am ready for strategic new opportunities! You can call me directly at +91 995 962 9041 or email me at myprofile.sayantan@gmail.com. Tapping the action buttons below will connect you with me instantly!",
      hasActions: true
    }
  },

  init(container) {
    if (!container) return;
    this.container = container;
    
    // Bind UI elements
    this.siriOrb = container.querySelector('#ai-siri-orb');
    this.orbCaption = container.querySelector('#ai-orb-caption');
    this.backPill = container.querySelector('#ai-back-pill');
    
    this.screens.intro = container.querySelector('#ai-screen-intro');
    this.screens.voice = container.querySelector('#ai-screen-voice');
    this.screens.chat = container.querySelector('#ai-screen-chat');
    
    this.chatInput = container.querySelector('#ai-chat-input');
    this.chatSend = container.querySelector('#ai-chat-send');
    this.chatThread = container.querySelector('#ai-chat-thread');
    this.chatInputWrapper = container.querySelector('#ai-chat-input-wrapper');

    if (!this.siriOrb) return;

    // Bind Event Listeners
    this.siriOrb.addEventListener('click', () => this.handleOrbTap());
    this.backPill.addEventListener('click', () => this.handleBackTap());

    // Bind Switcher Tabs
    const switcherBtns = container.querySelectorAll('.switcher-btn');
    switcherBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const mode = e.target.getAttribute('data-mode');
        this.switchMode(mode);
      });
    });

    // Bind Chat send button and enter keypress
    if (this.chatSend && this.chatInput) {
      this.chatSend.addEventListener('click', () => this.handleChatSubmit());
      this.chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.handleChatSubmit();
        }
      });
    }

    // Bind Suggestion Chips
    const chips = container.querySelectorAll('.ai-capsule-chip');
    chips.forEach(chip => {
      chip.addEventListener('click', (e) => {
        container.querySelectorAll('.ai-capsule-chip').forEach(c => c.classList.remove('selected'));
        e.currentTarget.classList.add('selected');
        const topic = e.currentTarget.getAttribute('data-topic');
        this.selectTopic(topic);
      });
    });

    // Bind Quick Chat Chips
    const chatChips = container.querySelectorAll('.ai-chat-chip');
    chatChips.forEach(chip => {
      chip.addEventListener('click', (e) => {
        container.querySelectorAll('.ai-chat-chip').forEach(c => c.classList.remove('selected'));
        e.currentTarget.classList.add('selected');
        const topic = e.currentTarget.getAttribute('data-topic');
        this.handleChatChipClick(topic);
      });
    });

    // Bind Voice Feed Scroll for dynamic teleprompter scroll focus fading
    const voiceFeed = container.querySelector('#ai-voice-feed');
    if (voiceFeed) {
      voiceFeed.addEventListener('scroll', () => this.handleVoiceFeedScroll());
    }

    // 1. Classic address bar auto-hide scroll trigger on load
    window.addEventListener('load', () => {
      setTimeout(() => {
        window.scrollTo(0, 1);
      }, 300);
    });

    // 2. Fullscreen Button Controller: manual high-fidelity fullscreen toggle
    const fsBtn = container.querySelector('#ai-fullscreen-btn');
    if (fsBtn) {
      fsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Detect iOS devices
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        
        if (isIOS) {
          // iOS Safari doesn't support the HTML5 Fullscreen API on iPhone. Show gorgeous iOS-native toast instructions!
          this.showToast("For fullscreen app mode: Tap Safari's 'Share' & select 'Add to Home Screen'!");
          return;
        }

        const el = document.documentElement;
        const isFS = document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement;

        if (!isFS) {
          if (el.requestFullscreen) {
            el.requestFullscreen();
          } else if (el.webkitRequestFullscreen) {
            el.webkitRequestFullscreen();
          } else if (el.msRequestFullscreen) {
            el.msRequestFullscreen();
          }
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
          }
        }
      });
    }

    // 3. Sync Fullscreen Icon and document status
    const updateFsIcon = () => {
      const isFS = document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
      const enterPath = container.querySelector('#ai-fullscreen-btn .enter-fs');
      const exitPath = container.querySelector('#ai-fullscreen-btn .exit-fs');
      
      if (enterPath && exitPath) {
        if (isFS) {
          enterPath.style.display = 'none';
          exitPath.style.display = 'block';
        } else {
          enterPath.style.display = 'block';
          exitPath.style.display = 'none';
        }
      }
    };
    
    document.addEventListener('fullscreenchange', updateFsIcon);
    document.addEventListener('webkitfullscreenchange', updateFsIcon);
    document.addEventListener('msfullscreenchange', updateFsIcon);

    // Clean up Speech Synthesis on unload
    window.addEventListener('beforeunload', () => this.stopSpeaking());

    // Boot assistant in Chat Mode by default
    this.switchMode('chat');
    this.transitionTo('intro');

    // Automatically redirect to active communication screen after 3.5s loading animation
    setTimeout(() => {
      const currentClasses = this.container.className;
      if (currentClasses.includes('state-intro')) {
        this.transitionTo('welcome');
        
        if (this.container.classList.contains('mode-chat')) {
          if (this.screens.chat) {
            this.screens.chat.classList.add('active');
          }
          if (this.chatInput) {
            setTimeout(() => this.chatInput.focus(), 100);
          }
        } else {
          this.startVoiceWelcome();
        }
      }
    }, 3500);
  },

  /**
   * Main transition engine controlling CSS State classes
   */
  transitionTo(state) {
    // 1. Remove all active states from container
    this.container.classList.remove('state-intro', 'state-welcome', 'state-qa', 'state-answer', 'state-listening');
    
    // 2. Hide all panels
    Object.values(this.screens).forEach(screen => {
      if (screen) screen.classList.remove('active');
    });

    // 3. Activate specific target state
    if (state === 'intro') {
      this.container.classList.add('state-intro');
      this.screens.intro.classList.add('active');
      this.orbCaption.innerText = "Press to start conversation";
    } 
    else if (state === 'welcome') {
      this.container.classList.add('state-welcome');
      this.screens.voice.classList.add('active');
      this.orbCaption.innerText = "Press to start conversation";
    }
    else if (state === 'qa') {
      this.container.classList.add('state-qa');
      this.screens.voice.classList.add('active');
      this.orbCaption.innerText = "Press to start conversation";
    }
    else if (state === 'answer') {
      this.container.classList.add('state-answer');
      this.screens.voice.classList.add('active');
      this.orbCaption.innerText = "Press to start conversation";
    }
    else if (state === 'listening') {
      this.container.classList.add('state-listening');
      this.screens.voice.classList.add('active');
      this.orbCaption.innerText = "Listening... Speak now";
    }
  },

  /**
   * Display dynamic glassmorphic notification toasts
   */
  showToast(message) {
    let toast = this.container.querySelector('.ai-toast-notification');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'ai-toast-notification';
      this.container.appendChild(toast);
    }
    toast.innerText = message;
    
    // Trigger animation frame classes
    toast.classList.remove('show');
    void toast.offsetWidth; // Force DOM style reflow
    toast.classList.add('show');
    
    // Autohide after 4.5 seconds
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
    this.toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  },

  handleOrbTap() {
    if (this.isSpeaking) {
      // Tap acts as pause/stop when speaking
      this.stopSpeaking();
      return;
    }

    const classes = this.container.className;
    
    if (classes.includes('state-intro')) {
      // If Chat Mode is active, transition straight to the Chat screen
      if (this.container.classList.contains('mode-chat')) {
        this.transitionTo('welcome'); // Transition to active conversation view
        if (this.screens.chat) {
          this.screens.chat.classList.add('active');
        }
        if (this.chatInput) {
          setTimeout(() => this.chatInput.focus(), 100);
        }
      } else {
        // 🚀 Stage 1: Transition into Welcome & begin voice synthesis (Voice Mode)
        this.transitionTo('welcome');
        
        const welcomeSpeech = "Hi, I am Sayantan. How can I help you with UX? Ask me about my... Professional, Educational, Personal, Skill, Thinking, Projects, or Communication!";
        
        // Wait for panel visual rise before speaking
        setTimeout(() => {
          this.speak(welcomeSpeech);
        }, 350); 
  
        // 🚀 Stage 2: Automatic 1.2s progressive fade-in of Suggestion Chips
        this.welcomeTimeout = setTimeout(() => {
          const currentClasses = this.container.className;
          if (currentClasses.includes('state-welcome')) {
            this.transitionTo('qa');
          }
        }, 1200);
      }
    } 
    else if (classes.includes('state-welcome') || classes.includes('state-qa') || classes.includes('state-answer')) {
      // 🎙️ Stage 3: Tap mic icon to start user speaking/listening state
      this.startListening();
    }
  },

  /**
   * Back button pill tap (returns to QA menu and halts speech/listening)
   */
  handleBackTap() {
    this.stopSpeaking();
    
    // Settle streams if listening
    if (this.audioStream) {
      this.audioStream.getTracks().forEach(track => track.stop());
      this.audioStream = null;
    }
    if (this.listeningTimeout) {
      clearTimeout(this.listeningTimeout);
      this.listeningTimeout = null;
    }

    const classes = this.container.className;
    
    // Reset Chat Mode to Voice Mode when returning to Intro Splash
    if (this.container.classList.contains('mode-chat')) {
      this.switchMode('voice');
    }

    if (classes.includes('state-answer')) {
      this.transitionTo('qa');
    } else {
      // 🚀 Return to Stage 1 splash landing screen!
      this.transitionTo('intro');
    }
  },

  /**
   * Topic selector (Injects markdown content and reads aloud)
   */
  selectTopic(topic) {
    const data = this.knowledgeBase[topic];
    if (!data) return;

    // Clear any pending welcome timeouts
    if (this.welcomeTimeout) {
      clearTimeout(this.welcomeTimeout);
      this.welcomeTimeout = null;
    }

    this.stopSpeaking();
    this.transitionTo('answer');

    // 1. Append User block asking for the topic inside the teleprompter feed
    this.appendVoiceBlock('user', `Tell me about your ${data.title.toLowerCase()}.`);

    // 2. Append AI response block inside the teleprompter feed
    const aiMessageId = `ai-voice-message-${Date.now()}`;
    let htmlContent = `<span class='ai-voice-title' style='display:block; font-size:0.76rem; font-weight:700; color:var(--color-primary-blue); text-transform:uppercase; letter-spacing:0.06em; margin-bottom:8px;'>${data.title}</span><p>${data.text}</p>`;
    
    if (data.hasActions) {
      htmlContent += `
        <div class="ai-answer-actions">
          <a href="tel:+919959629041" class="ai-answer-btn primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width: 13px; height: 13px; transform: scaleX(-1);"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            Call Sayantan
          </a>
          <a href="mailto:myprofile.sayantan@gmail.com?subject=Inquiry%20from%20Portfolio&body=Hi%20Sayantan,%0D%0A%0D%0AI%20explored%20your%20Conversational%20AI%20portfolio%20and%20would%20love%20to%20connect%20with%20you%20regarding%20UX%20opportunities!%0D%0A%0D%0ABest%20regards," class="ai-answer-btn secondary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width: 13px; height: 13px;"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            Email Sayantan
          </a>
        </div>
      `;
    }
    
    this.appendVoiceBlock('ai', htmlContent, aiMessageId);

    // Speak details and sync teleprompter word highlighting
    setTimeout(() => {
      this.speak(data.speech, aiMessageId);
      this.handleVoiceFeedScroll();
    }, 450);
  },

  /**
   * 🎙️ Start User Active Listening Loop
   */
  startListening() {
    this.stopSpeaking();
    
    if (this.welcomeTimeout) {
      clearTimeout(this.welcomeTimeout);
      this.welcomeTimeout = null;
    }
    if (this.listeningTimeout) {
      clearTimeout(this.listeningTimeout);
    }

    this.transitionTo('listening');
    this.orbCaption.innerText = "Listening... Speak now";
    
    // Start drawing horizontal active listening waves
    this.animateListeningWaves(false); // Starts animation loop with fallback sine curves
    
    // Request microphone stream using browser AudioContext
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      .then(stream => {
        this.audioStream = stream;
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.audioSource = this.audioContext.createMediaStreamSource(stream);
        this.audioAnalyser = this.audioContext.createAnalyser();
        this.audioAnalyser.fftSize = 256;
        this.audioSource.connect(this.audioAnalyser);
        
        const bufferLength = this.audioAnalyser.frequencyBinCount;
        this.audioDataArray = new Uint8Array(bufferLength);
        
        // Settle animation loop to react to the microphone
        cancelAnimationFrame(this.waveAnimationFrame);
        this.animateListeningWaves(true);
      })
      .catch(err => {
        console.warn("Using simulated active waves (mic permission denied):", err);
      });

    // Automatically transition to "Thinking..." and then reply after 4.5s
    this.listeningTimeout = setTimeout(() => {
      this.startThinking();
    }, 4500);
  },

  /**
   * 🧠 Thinking Transition
   */
  startThinking() {
    this.orbCaption.innerText = "Thinking...";
    
    // Close mic stream
    if (this.audioStream) {
      this.audioStream.getTracks().forEach(track => track.stop());
      this.audioStream = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    // Deliver conversational response after 1.5 seconds of thinking
    setTimeout(() => {
      // Return to suggestions dashboard
      this.transitionTo('qa');
      
      const responses = [
        "I heard your voice! I can help you learn more about me. Let me highlight my Professional experience, Educational academy background, or featured projects. Tap any capsule below to explore!",
        "Excellent query! I can share details on my UX design philosophy, B2B SaaS background, and product methodologies. Go ahead and select any suggestion chip below!",
        "Got it! Let me guide you through my tools, cognitive research methods, and case studies. Click any of the suggestion pills on the screen!"
      ];
      const randomReply = responses[Math.floor(Math.random() * responses.length)];
      
      // Append User block ("Voice Capture")
      this.appendVoiceBlock('user', "Voice Capture");

      // Append AI reply block dynamically
      const replyId = `ai-voice-message-${Date.now()}`;
      this.appendVoiceBlock('ai', randomReply, replyId);

      // Speak response dynamically and sync teleprompter word highlighting
      this.speak(randomReply, replyId);
    }, 1500);
  },

  /**
   * 🌊 Animate Horizontal Siri Active Wave Paths
   */
  animateListeningWaves(isMicActive) {
    if (this.container.classList.contains('state-listening') || this.container.classList.contains('speaking')) {
      this.waveAnimationFrame = requestAnimationFrame(() => this.animateListeningWaves(isMicActive));
    } else {
      cancelAnimationFrame(this.waveAnimationFrame);
      return;
    }

    let amplitudeMultiplier = 1.0;
    if (isMicActive && this.audioAnalyser) {
      this.audioAnalyser.getByteFrequencyData(this.audioDataArray);
      let sum = 0;
      for (let i = 0; i < this.audioDataArray.length; i++) {
        sum += this.audioDataArray[i];
      }
      let average = sum / this.audioDataArray.length;
      // Map average volume [0, 150] to amplitude multiplier [0.15, 2.5]
      amplitudeMultiplier = Math.max(0.15, Math.min(2.5, average / 24));
    } else {
      // High-end mathematical amplitude simulation (sinusoidal breathing)
      amplitudeMultiplier = 0.8 + Math.sin(Date.now() / 250) * 0.4 + Math.sin(Date.now() / 80) * 0.15;
    }

    const lines = [
      { selector: '.ai-wave-line-1', speed: 0.09, freq: 0.08, amp: 6, phase: 0 },
      { selector: '.ai-wave-line-2', speed: -0.12, freq: 0.11, amp: 4.5, phase: Math.PI / 4 },
      { selector: '.ai-wave-line-3', speed: 0.07, freq: 0.14, amp: 3.5, phase: Math.PI / 2 },
      { selector: '.ai-wave-line-4', speed: -0.08, freq: 0.06, amp: 2.5, phase: Math.PI * 0.75 }
    ];

    const time = Date.now() / 150;

    lines.forEach(line => {
      const el = this.container.querySelector(line.selector);
      if (!el) return;

      let pathD = "M 0 10";
      const segments = 16;
      for (let i = 1; i <= segments; i++) {
        const x = (i / segments) * 100;
        // Envelope pins left & right ends to Y=10 to keep wave fully self-contained
        const envelope = Math.sin((x / 100) * Math.PI);
        const y = 10 + Math.sin(x * line.freq + time * line.speed + line.phase) * line.amp * amplitudeMultiplier * envelope;
        pathD += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
      }

      el.setAttribute('d', pathD);
    });
  },

  /**
   * 🧼 DOM Text Tokenizer (Preserves formatting tags, wraps raw word strings in spans)
   */
  tokenizeTextNodes(node) {
    // Skip tokenizing inside buttons, links, action buttons, or suggestion stack
    if (node.nodeType === Node.ELEMENT_NODE) {
      const tagName = node.tagName.toUpperCase();
      if (tagName === 'BUTTON' || tagName === 'A' || node.classList.contains('ai-answer-actions') || node.classList.contains('ai-qa-stack')) {
        return; // Skip this element and all its children!
      }
    }

    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      const words = text.split(/(\s+)/); // Keep whitespace chunks intact
      const fragment = document.createDocumentFragment();
      
      words.forEach(word => {
        if (word.trim().length > 0) {
          const span = document.createElement('span');
          span.className = 'word';
          span.innerText = word;
          fragment.appendChild(span);
        } else {
          fragment.appendChild(document.createTextNode(word));
        }
      });
      
      node.parentNode.replaceChild(fragment, node);
    } else {
      // Loop backward since childNodes list updates in-place when replacing nodes
      const children = Array.from(node.childNodes);
      children.forEach(child => this.tokenizeTextNodes(child));
    }
  },

  /**
   * Browser-Native Speech Synthesis (Web Speech API)
   */
  speak(text, targetId) {
    if (!('speechSynthesis' in window)) {
      console.warn("Speech synthesis not supported in this browser.");
      return;
    }

    // Cancel active speech
    window.speechSynthesis.cancel();

    // 🎙️ Initialize synchronizer: tokenize active screen texts word-by-word
    let textContainer = null;
    if (targetId) {
      textContainer = this.container.querySelector('#' + targetId);
    } else {
      if (this.container.classList.contains('state-welcome') || this.container.classList.contains('state-qa') || this.container.classList.contains('state-listening')) {
        textContainer = this.container.querySelector('#ai-welcome-message');
      }
    }

    if (textContainer) {
      // 1. Reset innerHTML to original text state
      if (textContainer.id === 'ai-welcome-message') {
        textContainer.innerHTML = "Hi, I am Sayantan. How can I help you with UX? Ask me about my...";
      } else if (textContainer.hasAttribute('data-original-html')) {
        textContainer.innerHTML = textContainer.getAttribute('data-original-html');
      }
      
      // 2. Wrap all text nodes into spans in-place
      this.tokenizeTextNodes(textContainer);
      
      // 3. Build plainText to span boundary maps using regular expression word boundaries
      const spans = textContainer.querySelectorAll('.word');
      const plainText = text;
      let searchStartIndex = 0;
      this.activeWordMap = [];
      
      spans.forEach(span => {
        const wordText = span.innerText.trim();
        // Strip leading and trailing punctuation to perform clean search matching
        const cleanWord = wordText.replace(/^[.,?\/#!$%\^&\*;:{}=\-_`~()""'“”‘’+]+|[.,?\/#!$%\^&\*;:{}=\-_`~()""'“”‘’+]+$/g, "");
        if (cleanWord.length === 0) return;
        
        // Escape special regular expression operators
        const escapedWord = cleanWord.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        
        // Match word boundaries \b sequentially to prevent substring collision (like 'an' in 'San' or 'I' in 'AI')
        const regex = new RegExp('\\b' + escapedWord + '\\b', 'i');
        const remainingText = plainText.substring(searchStartIndex);
        const match = remainingText.match(regex);
        
        if (match && match.index !== undefined) {
          const absoluteStart = searchStartIndex + match.index;
          this.activeWordMap.push({
            span: span,
            start: absoluteStart,
            end: absoluteStart + match[0].length,
            word: wordText
          });
          // Update pointer to end of match to ensure sequence moves forward
          searchStartIndex = absoluteStart + match[0].length;
        }
      });

      // 🎙️ High-end sync: if this is the welcome text sequence, ALSO map each suggestion chip to its spoken word!
      if (textContainer.id === 'ai-welcome-message') {
        const chips = this.container.querySelectorAll('.ai-capsule-chip');
        chips.forEach(chip => {
          const chipText = chip.innerText.trim();
          const cleanWord = chipText.replace(/^[.,?\/#!$%\^&\*;:{}=\-_`~()""'“”‘’+]+|[.,?\/#!$%\^&\*;:{}=\-_`~()""'“”‘’+]+$/g, "");
          if (cleanWord.length === 0) return;
          
          const escapedWord = cleanWord.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
          const regex = new RegExp('\\b' + escapedWord + '\\b', 'i');
          const remainingText = plainText.substring(searchStartIndex);
          const match = remainingText.match(regex);
          
          if (match && match.index !== undefined) {
            const absoluteStart = searchStartIndex + match.index;
            this.activeWordMap.push({
              span: chip, // Maps to the button container itself!
              start: absoluteStart,
              end: absoluteStart + match[0].length,
              word: chipText
            });
            // Update pointer to ensure sequence moves forward
            searchStartIndex = absoluteStart + match[0].length;
          }
        });
      }
    }

    this.speechUtterance = new SpeechSynthesisUtterance(text);
    this.speechUtterance.rate = 1.05; // Executive pace
    this.speechUtterance.pitch = 1.0;
    
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      const targetVoice = voices.find(v => v.lang.startsWith('en-') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Siri')));
      if (targetVoice) {
        this.speechUtterance.voice = targetVoice;
      }
    }

    // Speech Event Listeners
    this.speechUtterance.onstart = () => {
      this.isSpeaking = true;
      this.container.classList.add('speaking');
      if (this.siriOrb) {
        this.siriOrb.classList.add('speaking');
        if (this.siriOrb.parentElement) {
          this.siriOrb.parentElement.classList.add('speaking');
        }
      }
      this.orbCaption.innerText = "Tap orb to pause / stop voice";
      
      // Start horizontal wave animation automatically Reacting to the speaking voice!
      this.animateListeningWaves(false);
    };

    // ⚡ Synchronize word boundaries with character offsets dynamically
    this.speechUtterance.onboundary = (event) => {
      if (event.name === 'word' && this.activeWordMap.length > 0) {
        const charIndex = event.charIndex;
        this.activeWordMap.forEach(item => {
          if (item.start <= charIndex) {
            item.span.classList.add('spoken');
          } else {
            item.span.classList.remove('spoken');
          }
        });
      }
    };

    this.speechUtterance.onend = () => {
      this.isSpeaking = false;
      this.container.classList.remove('speaking');
      if (this.siriOrb) {
        this.siriOrb.classList.remove('speaking');
        if (this.siriOrb.parentElement) {
          this.siriOrb.parentElement.classList.remove('speaking');
        }
      }
      this.orbCaption.innerText = "Press to start conversation";
      // Fully highlight all words on end
      if (this.activeWordMap.length > 0) {
        this.activeWordMap.forEach(item => item.span.classList.add('spoken'));
      }
    };

    this.speechUtterance.onerror = (e) => {
      console.error("Speech Synthesis Error:", e);
      this.isSpeaking = false;
      this.container.classList.remove('speaking');
      if (this.siriOrb) {
        this.siriOrb.classList.remove('speaking');
        if (this.siriOrb.parentElement) {
          this.siriOrb.parentElement.classList.remove('speaking');
        }
      }
      this.orbCaption.innerText = "Press to start conversation";
    };

    window.speechSynthesis.speak(this.speechUtterance);
  },

  /**
   * Halt speech and reset orb
   */
  stopSpeaking() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
    this.container.classList.remove('speaking');
    
    // Clear active word boundary maps and classes
    if (this.activeWordMap.length > 0) {
      this.activeWordMap.forEach(item => {
        item.span.classList.remove('spoken');
      });
      this.activeWordMap = [];
    }

    if (this.siriOrb) {
      this.siriOrb.classList.remove('speaking');
      if (this.siriOrb.parentElement) {
        this.siriOrb.parentElement.classList.remove('speaking');
      }
    }
    if (this.orbCaption) {
      this.orbCaption.innerText = "Press to start conversation";
    }
  },

  /**
   * Switch between voice and chat modes (Tracto-inspired tab bar action)
   */
  switchMode(mode) {
    const switcherBtns = this.container.querySelectorAll('.switcher-btn');
    switcherBtns.forEach(btn => {
      if (btn.getAttribute('data-mode') === mode) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    if (mode === 'chat') {
      this.container.classList.add('mode-chat');
      this.stopSpeaking();
      
      // Cancel mic capture if active
      if (this.audioStream) {
        this.audioStream.getTracks().forEach(track => track.stop());
        this.audioStream = null;
      }
      if (this.audioContext) {
        this.audioContext.close();
        this.audioContext = null;
      }
      if (this.listeningTimeout) {
        clearTimeout(this.listeningTimeout);
        this.listeningTimeout = null;
      }
      
      // Make sure chat screen has active class
      if (this.screens.chat) {
        this.screens.chat.classList.add('active');
      }
      
      // Focus input field
      if (this.chatInput) {
        setTimeout(() => this.chatInput.focus(), 100);
      }
      
      // Scroll thread to bottom
      this.scrollChatToBottom();
    } else {
      this.container.classList.remove('mode-chat');
      if (this.screens.chat) {
        this.screens.chat.classList.remove('active');
      }
      
      // Restore appropriate voice screens
      const classes = this.container.className;
      if (classes.includes('state-intro')) {
        this.screens.intro.classList.add('active');
      } else {
        this.screens.voice.classList.add('active');
        // If welcome hasn't been played yet, play it!
        if (!this.welcomePlayed) {
          this.transitionTo('welcome');
          this.startVoiceWelcome();
          this.welcomePlayed = true;
        }
      }
    }
  },

  /**
   * Handle text submissions in Chat Mode
   */
  handleChatSubmit() {
    if (!this.chatInput) return;
    const text = this.chatInput.value.trim();
    if (!text) return;
    
    // 1. Clear input field
    this.chatInput.value = '';
    
    // 2. Add User bubble
    this.addChatBubble('user', text);
    this.scrollChatToBottom();
    
    // 3. Add Typing indicator
    this.addTypingBubble();
    this.scrollChatToBottom();
    
    // 4. Match query against knowledge base and respond after 1.2s
    setTimeout(() => {
      this.removeTypingBubble();
      
      const matchedTopic = this.findMatchingTopic(text);
      let replyText = "";
      if (matchedTopic) {
        const data = this.knowledgeBase[matchedTopic];
        replyText = data.text;
      } else {
        replyText = "I'm here to help you learn more about Sayantan! You can ask about his <span class='highlight-blue'>Professional</span> experience, <span class='highlight-green'>Educational</span> credentials, <span class='highlight-blue'>Personal</span> design philosophy, <span class='highlight-green'>Skills</span>, <span class='highlight-blue'>UX Thinking</span> process, featured <span class='highlight-green'>Projects</span>, or how to <span class='highlight-blue'>Contact</span> him.";
      }
      
      this.addChatBubble('ai', replyText);
      this.scrollChatToBottom();
    }, 1200);
  },

  /**
   * Click handler for Quick suggestion chips in Chat mode
   */
  handleChatChipClick(topic) {
    const data = this.knowledgeBase[topic];
    if (!data) return;
    
    // Submit topic name as user message
    this.chatInput.value = topic;
    this.handleChatSubmit();
  },

  /**
   * Simple keyword/topic matcher
   */
  findMatchingTopic(text) {
    const query = text.toLowerCase();
    
    // Professional matches
    if (query.includes('profess') || query.includes('work') || query.includes('job') || query.includes('exp') || query.includes('career')) {
      return 'Professional';
    }
    // Educational matches
    if (query.includes('educat') || query.includes('iit') || query.includes('roorkee') || query.includes('college') || query.includes('degree') || query.includes('academy') || query.includes('study')) {
      return 'Educational';
    }
    // Personal matches
    if (query.includes('personal') || query.includes('about') || query.includes('who is') || query.includes('sayantan') || query.includes('san')) {
      return 'Personal';
    }
    // Skill matches
    if (query.includes('skill') || query.includes('tool') || query.includes('software') || query.includes('figma') || query.includes('framer') || query.includes('miro') || query.includes('stack')) {
      return 'Skill';
    }
    // Thinking matches
    if (query.includes('think') || query.includes('process') || query.includes('method') || query.includes('research') || query.includes('quiet failure') || query.includes('interview')) {
      return 'Thinking';
    }
    // Projects matches
    if (query.includes('project') || query.includes('case study') || query.includes('featured') || query.includes('tracto') || query.includes('elder')) {
      return 'Projects';
    }
    // Communication matches
    if (query.includes('communicat') || query.includes('contact') || query.includes('touch') || query.includes('email') || query.includes('phone') || query.includes('call') || query.includes('reach')) {
      return 'Communication';
    }
    
    // Direct string match fallback
    for (const key of Object.keys(this.knowledgeBase)) {
      if (query.includes(key.toLowerCase())) {
        return key;
      }
    }
    
    return null;
  },

  addChatBubble(sender, text) {
    if (!this.chatThread) return;
    
    const bubble = document.createElement('div');
    bubble.className = `ai-chat-bubble ai-bubble-${sender}`;
    
    if (sender === 'ai') {
      // Clean, iPhone slick text-only container
      const contentDiv = document.createElement('div');
      contentDiv.className = 'ai-bubble-content';
      
      const p = document.createElement('p');
      p.innerHTML = text; // Allow inline HTML formatting highlights
      contentDiv.appendChild(p);
      
      bubble.appendChild(contentDiv);
    } else {
      bubble.innerText = text;
    }
    
    this.chatThread.appendChild(bubble);
  },

  /**
   * Append a typing indicator bubble
   */
  addTypingBubble() {
    if (!this.chatThread) return;
    
    // Remove if already exists
    this.removeTypingBubble();
    
    const bubble = document.createElement('div');
    bubble.className = 'ai-chat-bubble ai-bubble-typing';
    bubble.id = 'ai-chat-typing-indicator';
    
    bubble.innerHTML = '<span></span><span></span><span></span>';
    this.chatThread.appendChild(bubble);
  },

  /**
   * Remove the typing indicator bubble
   */
  removeTypingBubble() {
    const indicator = document.getElementById('ai-chat-typing-indicator');
    if (indicator) {
      indicator.remove();
    }
  },

  /**
   * Scroll chat thread view to the absolute bottom smoothly
   */
  scrollChatToBottom() {
    if (!this.chatThread) return;
    this.chatThread.scrollTo({
      top: this.chatThread.scrollHeight,
      behavior: 'smooth'
    });
  },

  /**
   * Initialize and trigger the Voice mode welcome sequence in the teleprompter feed
   */
  startVoiceWelcome() {
    this.stopSpeaking();
    
    // Clear and build welcome card inside Voice teleprompter feed
    const feed = this.container.querySelector('#ai-voice-feed');
    if (feed) {
      feed.innerHTML = `
        <!-- Dialogue 1: Sayantan's Welcome Voice (Focal Big Text Prompter) -->
        <div class="ai-voice-block" id="ai-voice-welcome-block">
          <div class="ai-voice-avatar-wrapper ai-voice-ai-avatar">
            <img src="../images/sayantan_pic.png" alt="Sayantan Ghosh" class="ai-voice-avatar" />
          </div>
          <p class="ai-voice-text" id="ai-welcome-message">
            Hi, I am Sayantan. How can I help you with UX? Ask me about my...
          </p>
          
          <!-- suggestion chips stacked in rows for ergonomic thumb clicks -->
          <nav class="ai-qa-stack active" id="ai-suggestion-chips" aria-label="Topics Navigation">
            <div class="ai-qa-row">
              <button class="ai-capsule-chip" data-topic="Professional">Professional</button>
              <button class="ai-capsule-chip" data-topic="Educational">Educational</button>
              <button class="ai-capsule-chip" data-topic="Personal">Personal</button>
            </div>
            <div class="ai-qa-row">
              <button class="ai-capsule-chip" data-topic="Skill">Skill</button>
              <button class="ai-capsule-chip" data-topic="Thinking">Thinking</button>
              <button class="ai-capsule-chip" data-topic="Projects">Projects</button>
            </div>
            <div class="ai-qa-row">
              <button class="ai-capsule-chip" data-topic="Communication">Communication</button>
            </div>
          </nav>
        </div>
      `;
      
      // Re-bind click event listeners to suggestion chips inside Voice feed
      const chips = feed.querySelectorAll('.ai-capsule-chip');
      chips.forEach(chip => {
        chip.addEventListener('click', (e) => {
          feed.querySelectorAll('.ai-capsule-chip').forEach(c => c.classList.remove('selected'));
          e.currentTarget.classList.add('selected');
          const topic = e.currentTarget.getAttribute('data-topic');
          this.selectTopic(topic);
        });
      });
    }

    const welcomeSpeech = "Hi, I am Sayantan. How can I help you with UX? Ask me about my... Professional, Educational, Personal, Skill, Thinking, Projects, or Communication!";
    
    // Wait for slide animations before starting speech
    setTimeout(() => {
      this.speak(welcomeSpeech, 'ai-welcome-message');
      this.handleVoiceFeedScroll();
    }, 450);
  },

  /**
   * Append dialogue transcription cards inside the Voice teleprompter feed
   */
  appendVoiceBlock(sender, text, id) {
    const feed = this.container.querySelector('#ai-voice-feed');
    if (!feed) return;
    
    // Mark all existing blocks as past/inactive
    const existingBlocks = feed.querySelectorAll('.ai-voice-block');
    existingBlocks.forEach(block => {
      block.classList.add('inactive-block');
    });
    
    const block = document.createElement('div');
    block.className = 'ai-voice-block';
    if (id) block.id = id + '-block';
    
    if (sender === 'ai') {
      block.innerHTML = `
        <div class="ai-voice-avatar-wrapper ai-voice-ai-avatar">
          <img src="../images/sayantan_pic.png" alt="Sayantan Ghosh" class="ai-voice-avatar" />
        </div>
        <div class="ai-voice-text" id="${id}">${text}</div>
      `;
      // Store original HTML in a data attribute for clean tokenization resets
      const textElem = block.querySelector('#' + id);
      if (textElem) {
        textElem.setAttribute('data-original-html', text);
      }
    } else {
      block.innerHTML = `
        <div class="ai-voice-avatar-wrapper ai-voice-user-avatar">
          <svg class="ai-voice-user-graphic" viewBox="0 0 24 24" style="width: 20px; height: 20px; fill: var(--color-primary-blue);">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zm5.5 10a5.5 5.5 0 0 1-11 0V11H5v1a7 7 0 0 0 6 6.91V22h2v-3.09A7 7 0 0 0 19 12v-1h-1.5v1z"/>
          </svg>
        </div>
        <div class="ai-voice-text ai-voice-user-text" id="${id || ''}">${text}</div>
      `;
    }
    
    feed.appendChild(block);
    this.scrollVoiceToBottom();
  },

  /**
   * Scroll Voice teleprompter view to the absolute bottom smoothly
   */
  scrollVoiceToBottom() {
    const feed = this.container.querySelector('#ai-voice-feed');
    if (!feed) return;
    feed.scrollTo({
      top: feed.scrollHeight,
      behavior: 'smooth'
    });
    // Calculate focus opacities during transition
    setTimeout(() => this.handleVoiceFeedScroll(), 100);
    setTimeout(() => this.handleVoiceFeedScroll(), 300);
  },

  /**
   * Dynamic teleprompter scroll focus fading. Older blocks are depressed/dimmed,
   * but gradually light up to pure white as the user scrolls them into focus center.
   */
  handleVoiceFeedScroll() {
    const feed = this.container.querySelector('#ai-voice-feed');
    if (!feed) return;
    
    const blocks = feed.querySelectorAll('.ai-voice-block');
    const feedRect = feed.getBoundingClientRect();
    const feedCenter = feedRect.top + feedRect.height / 2;
    
    blocks.forEach(block => {
      const textElement = block.querySelector('.ai-voice-text');
      if (!textElement) return;
      
      const blockRect = block.getBoundingClientRect();
      const blockCenter = blockRect.top + blockRect.height / 2;
      
      // Calculate distance from scroll viewport center
      const maxDistance = feedRect.height / 1.8; // Focus fade window bounds
      const distance = Math.abs(blockCenter - feedCenter);
      
      // Map distance to opacity: 1.0 at center focus, fading down to 0.28 at boundaries
      let opacity = 1.0 - (distance / maxDistance);
      opacity = Math.max(0.28, Math.min(1.0, opacity));
      
      // Apply smooth dynamic opacity directly to the text element
      textElement.style.opacity = opacity;
      
      // Smoothly dim the accompanying avatar wrapper
      const avatar = block.querySelector('.ai-voice-avatar-wrapper');
      if (avatar) {
        avatar.style.opacity = Math.max(0.35, opacity);
      }
    });
  }
};
