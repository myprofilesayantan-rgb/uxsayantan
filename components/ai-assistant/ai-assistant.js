/**
 * 🤖 Conversational AI Assistant Module (Siri & Gemini Experience)
 * Handles:
 * 1. 3-stage UI transitions: Splash Intro -> Welcome -> QA Stack -> Answer Cards
 * 2. Native, free client-side Voice Over (Web Speech API speechSynthesis)
 * 3. Accurate intent matching & rich dynamic deflective contact cards
 * 4. Zero external server dependencies ($0 hosting on GitHub Pages)
 */

window.PortfolioAiAssistant = {
  container: null,
  siriOrb: null,
  orbCaption: null,
  backPill: null,
  screens: {
    intro: null,
    welcome: null,
    answer: null
  },
  answerTitle: null,
  answerContent: null,
  
  // Web Speech API synthesis hooks
  speechUtterance: null,
  isSpeaking: false,
  welcomePlayed: false,

  // Conversational facts database mapping directly to the stacked capsules
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
    this.screens.welcome = container.querySelector('#ai-screen-welcome');
    this.screens.answer = container.querySelector('#ai-screen-answer');
    
    this.answerTitle = container.querySelector('#ai-answer-title');
    this.answerContent = container.querySelector('#ai-answer-content');

    if (!this.siriOrb) return;

    // Bind Event Listeners
    this.siriOrb.addEventListener('click', () => this.handleOrbTap());
    this.backPill.addEventListener('click', () => this.handleBackTap());

    // Bind Suggestion Chips
    const chips = container.querySelectorAll('.ai-capsule-chip');
    chips.forEach(chip => {
      chip.addEventListener('click', (e) => {
        const topic = e.target.getAttribute('data-topic');
        this.selectTopic(topic);
      });
    });

    // Bind Hamburger Menu to close/deflect
    const hamburger = container.querySelector('.ai-mobile-menu');
    if (hamburger) {
      hamburger.addEventListener('click', () => {
        this.selectTopic('Communication');
      });
    }

    // Initialize Speech Synthesis Stop on Window Close
    window.addEventListener('beforeunload', () => this.stopSpeaking());
  },

  /**
   * Main transition engine controlling CSS State classes
   */
  transitionTo(state) {
    // 1. Remove all active states from container
    this.container.classList.remove('state-intro', 'state-welcome', 'state-qa', 'state-answer');
    
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
      this.screens.welcome.classList.add('active');
      this.orbCaption.innerText = "Press to start conversation";
    }
    else if (state === 'answer') {
      this.container.classList.add('state-answer');
      this.screens.answer.classList.add('active');
      this.orbCaption.innerText = "Listening...";
    }
  },

  /**
   * Siri Orb Tap handler (Listening, Speaking, Stop)
   */
  handleOrbTap() {
    if (this.isSpeaking) {
      // If AI is currently speaking, a tap acts as "Pause/Stop"
      this.stopSpeaking();
      return;
    }

    const currentClass = this.container.className;
    
    if (currentClass.includes('state-intro')) {
      // 🚀 Stage 1: Transition into welcome and play voice over greeting
      this.transitionTo('welcome');
      
      const welcomeSpeech = "Hi! My name is San, the AI assistant of Sayantan. I can answer your questions. Tap any capsule pill below to explore his professional background!";
      
      setTimeout(() => {
        this.speak(welcomeSpeech);
      }, 350); // Small fluid delay for visual transition
    } 
    else if (currentClass.includes('state-welcome') || currentClass.includes('state-answer')) {
      // Simulate listening trigger visual response
      this.orbCaption.innerText = "I am listening... Ask me about his Skills, Tracto, or Experience!";
      this.siriOrb.style.transform = "scale(1.15)";
      
      // Seed native voice feedback in case they click without topic
      setTimeout(() => {
        this.siriOrb.style.transform = "";
        this.orbCaption.innerText = "Select a capsule pill above!";
      }, 2000);
    }
  },

  /**
   * Back button pill tap (dismisses answer card and returns to QA chips)
   */
  handleBackTap() {
    this.stopSpeaking();
    this.transitionTo('welcome');
  },

  /**
   * Captures capsule chip clicks to render detailed answers and start voiceover
   */
  selectTopic(topic) {
    const data = this.knowledgeBase[topic];
    if (!data) return;

    this.stopSpeaking();
    this.transitionTo('answer');

    // Inject title and markup content
    this.answerTitle.innerText = data.title;
    
    let htmlContent = `<div class='ai-answer-content'><p>${data.text}</p>`;
    
    // If it is the contact prompt, render actual direct-tap utility buttons!
    if (data.hasActions) {
      htmlContent += `
        <div class="ai-answer-actions">
          <a href="tel:+919959629041" class="ai-answer-btn primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width: 13px; height: 13px; transform: scaleX(-1);"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            Call Sayantan
          </a>
          <a href="mailto:myprofile.sayantan@gmail.com?subject=Inquiry%20from%20Portfolio&body=Hi%20Sayantan,%0D%0A%0D%0AI%20explored%20your%20Conversational%20AI%20portfolio%20and%20would%20love%20to%20connect%20with%20you%20regarding%20UX%20opportunities!%0D%0A%0D%0ABest%20regards," class="ai-answer-btn secondary">
            Email Sayantan
          </a>
        </div>
      `;
    }
    
    htmlContent += `</div>`;
    this.answerContent.innerHTML = htmlContent;

    // Trigger Speech Voice Over (Web Speech API)
    setTimeout(() => {
      this.speak(data.speech);
    }, 400);
  },

  /**
   * Free Browser-Native Text-to-Speech Engine (Web Speech API)
   */
  speak(text) {
    if (!('speechSynthesis' in window)) {
      console.warn("Speech synthesis not supported in this browser.");
      return;
    }

    // 1. Interrupt any active speech immediately
    window.speechSynthesis.cancel();

    // 2. Construct clean utterance
    this.speechUtterance = new SpeechSynthesisUtterance(text);
    
    // Configure voice properties
    this.speechUtterance.rate = 1.05; // Slightly faster for slick executive cadence
    this.speechUtterance.pitch = 1.0;
    
    // Choose natural-sounding English voice if available on user device
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      // Prefer Google or Siri English natural system voices
      const targetVoice = voices.find(v => v.lang.startsWith('en-') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Siri')));
      if (targetVoice) {
        this.speechUtterance.voice = targetVoice;
      }
    }

    // 3. Hook state listeners for Visual Siri Orb feedback
    this.speechUtterance.onstart = () => {
      this.isSpeaking = true;
      this.siriOrb.classList.add('speaking');
      this.orbCaption.innerText = "Tap orb to pause / stop voice";
    };

    this.speechUtterance.onend = () => {
      this.isSpeaking = false;
      this.siriOrb.classList.remove('speaking');
      
      const currentClass = this.container.className;
      if (currentClass.includes('state-answer')) {
        this.orbCaption.innerText = "Select next topic or press back";
      } else {
        this.orbCaption.innerText = "Select a capsule pill above!";
      }
    };

    this.speechUtterance.onerror = (e) => {
      console.error("Speech Synthesis Error:", e);
      this.isSpeaking = false;
      this.siriOrb.classList.remove('speaking');
    };

    // 4. Start speaking
    window.speechSynthesis.speak(this.speechUtterance);
  },

  /**
   * Instantly halt speech synthesis and reset active states
   */
  stopSpeaking() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
    if (this.siriOrb) {
      this.siriOrb.classList.remove('speaking');
    }
    const currentClass = this.container ? this.container.className : '';
    if (currentClass.includes('state-answer')) {
      if (this.orbCaption) this.orbCaption.innerText = "Speech stopped. Select next topic!";
    } else {
      if (this.orbCaption) this.orbCaption.innerText = "Select a capsule pill above!";
    }
  }
};
