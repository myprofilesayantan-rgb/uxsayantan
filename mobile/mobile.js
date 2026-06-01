/**
 * 🤖 Pure Chat isolated Mobile Controller Script
 * Handles:
 * 1. 2-Stage Splash Transition: Intro Splash Screen -> Chat Screen
 * 2. Sticky Glassmorphic iMessage-slick Chat Thread & Auto-focus Keyboard View
 * 3. Quick suggest chip events & dynamic Call/Email deflection action triggers
 * 4. High-fidelity Fullscreen Button & iOS Safari "Add to Home Screen" manual fallback guides
 */

window.MobileAiAssistant = {
  container: null,
  screens: {
    intro: null,
    chat: null
  },
  chatInput: null,
  chatSend: null,
  chatThread: null,
  chatInputWrapper: null,
  toastTimeout: null,
  menuOverlay: null,
  menuCloseBtn: null,
  menuCloseArea: null,

  // Knowledge base containing response content for suggested topics
  knowledgeBase: {
    Professional: {
      title: "Professional Experience",
      text: "I bring over <span class='highlight-blue'>22 years of design experience</span>, including more than 9 years focused deeply on UX. I have shaped real products within real-world constraints across domains like B2B SaaS, Healthcare, Gaming, and Productivity. My philosophy is to balance business goals with absolute user dignity by combining behavioral insights and advanced AI-driven workflows."
    },
    Educational: {
      title: "Education & Academy",
      text: "I hold a prestigious <span class='highlight-green'>Executive PG in UX from IIT Roorkee</span>. This structured academic grounding governs my approach to interaction models, design research ethics, cognitive psychology, and accessibility standard testing."
    },
    Personal: {
      title: "About Sayantan",
      text: "I believe that in the age of AI, designers must think beyond screens. I approach problems with deep curiosity, challenge raw assumptions, and create clean, structural experiences that simplify complexity. My focus is always on solving meaningful human problems."
    },
    Skill: {
      title: "Tools & Core Skills",
      text: "My technical stack includes <span class='highlight-blue'>Framer, Figma, Miro, Claude, Gemini, and Antigravity</span>. I specialize in advanced interaction design (IxDF certified), contextual research, affinity mapping, user personas, and high-fidelity responsive prototyping."
    },
    Thinking: {
      title: "UX Thinking Process",
      text: "My process starts by investigating <span class='highlight-green'>'quiet failures'</span>—things humans adapt to without questioning (like price stickers or capacitive door handles). I run active and passive contextual interviews to observe users in the moment, rather than relying on reconstructed memories, clustering observations into actionable affinity matrices."
    },
    Projects: {
      title: "Featured Case Study",
      text: "My featured project is <span class='highlight-blue'>Tracto</span>: an eldercare healthcare ecosystem. By mapping chronic health needs and emotional independence, I designed a silent, passive monitoring app that restored elder freedom and caregiver peace of mind without constant, anxious check-in calls."
    },
    Communication: {
      title: "Get In Touch",
      text: "I am ready for strategic new opportunities! You can <span class='highlight-blue'>call me directly at +91 995 962 9041</span> or email me at <span class='highlight-green'>myprofile.sayantan@gmail.com</span>. Tapping the action buttons below will connect you with me instantly!",
      hasActions: true
    }
  },

  init(container) {
    if (!container) return;
    this.container = container;

    // Bind UI elements
    this.screens.intro = container.querySelector('#ai-screen-intro');
    this.screens.chat = container.querySelector('#ai-screen-chat');

    this.chatInput = container.querySelector('#ai-chat-input');
    this.chatSend = container.querySelector('#ai-chat-send');
    this.chatThread = container.querySelector('#ai-chat-thread');
    this.chatInputWrapper = container.querySelector('#ai-chat-input-wrapper');

    // Bind Chat send button and enter keypress
    if (this.chatSend && this.chatInput) {
      this.chatSend.addEventListener('click', () => this.handleChatSubmit());
      this.chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.handleChatSubmit();
        }
      });
    }

    // Bind Quick Chat suggestion chips
    this.bindChatChips(container);

    // Bind Menu Overlay elements
    this.menuOverlay = document.getElementById('ai-menu-overlay');
    this.menuCloseBtn = document.getElementById('ai-menu-close-btn');
    this.menuCloseArea = document.getElementById('ai-menu-close-area');

    const headerMenu = container.querySelector('.ai-mobile-menu');
    if (headerMenu) {
      headerMenu.addEventListener('click', () => this.openMenu());
    }
    if (this.menuCloseBtn) {
      this.menuCloseBtn.addEventListener('click', () => this.closeMenu());
    }
    if (this.menuCloseArea) {
      this.menuCloseArea.addEventListener('click', () => this.closeMenu());
    }

    // Bind interactive menu link buttons
    const menuLinks = document.querySelectorAll('.ai-menu-link-btn');
    menuLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const topic = e.currentTarget.getAttribute('data-topic');
        this.closeMenu();
        if (topic) {
          // If we are currently in intro screen, switch to chat
          if (this.container.classList.contains('state-intro')) {
            this.transitionTo('chat');
          }
          this.handleChatChipClick(topic);
        }
      });
    });

    // Initial Splash Screen boot setup
    this.transitionTo('intro');

    // Automatically transition to Chat screen after 3.5s splash animation
    setTimeout(() => {
      if (this.container.classList.contains('state-intro')) {
        this.transitionTo('chat');
      }
    }, 3500);
  },

  /**
   * Bind events to quick topic chips inside any container viewport
   */
  bindChatChips(parent) {
    const chatChips = parent.querySelectorAll('.ai-chat-chip');
    chatChips.forEach(chip => {
      chip.addEventListener('click', (e) => {
        parent.querySelectorAll('.ai-chat-chip').forEach(c => c.classList.remove('selected'));
        e.currentTarget.classList.add('selected');
        const topic = e.currentTarget.getAttribute('data-topic');
        this.handleChatChipClick(topic);
      });
    });
  },

  /**
   * Main transition engine controlling CSS State classes
   */
  transitionTo(state) {
    // 1. Remove intro states from container
    this.container.classList.remove('state-intro');

    // 2. Hide all panels
    Object.values(this.screens).forEach(screen => {
      if (screen) screen.classList.remove('active');
    });

    // 3. Activate target panel
    if (state === 'intro') {
      this.container.classList.add('state-intro');
      if (this.screens.intro) this.screens.intro.classList.add('active');
    } 
    else if (state === 'chat') {
      if (this.screens.chat) this.screens.chat.classList.add('active');

      // Auto focus the input field with a minor delay for smooth phone keyboard slide-up
      if (this.chatInput) {
        setTimeout(() => this.chatInput.focus(), 150);
      }
      this.scrollChatToBottom();
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

    // 2. Add User message bubble to viewport
    this.addChatBubble('user', text);
    this.scrollChatToBottom();

    // 3. Trigger typing simulation bouncing dot bubble
    this.addTypingBubble();
    this.scrollChatToBottom();

    // 4. Match query against knowledge base and respond after 1.2s delay
    setTimeout(() => {
      this.removeTypingBubble();

      const matchedTopic = this.findMatchingTopic(text);
      let replyText = "";
      
      if (matchedTopic) {
        const data = this.knowledgeBase[matchedTopic];
        replyText = data.text;
      } else {
        replyText = "I am here to help you explore Sayantan's design portfolio! You can ask about his <span class='highlight-blue'>Professional</span> experience, <span class='highlight-green'>Educational</span> PG at IIT Roorkee, <span class='highlight-blue'>Personal</span> principles, <span class='highlight-green'>Skills</span> stack, <span class='highlight-blue'>UX Thinking</span> process, featured <span class='highlight-green'>Projects</span>, or how to <span class='highlight-blue'>Contact</span> him.";
      }

      this.addChatBubble('ai', replyText, matchedTopic);
      this.scrollChatToBottom();
    }, 1200);
  },

  /**
   * Click handler for suggestion chips inside bubbles
   */
  handleChatChipClick(topic) {
    if (!this.chatInput) return;
    this.chatInput.value = topic;
    this.handleChatSubmit();
  },

  /**
   * Simple, robust keyword and topic matcher
   */
  findMatchingTopic(text) {
    const query = text.toLowerCase();

    // Professional matches
    if (query.includes('profess') || query.includes('work') || query.includes('job') || query.includes('exp') || query.includes('career') || query.includes('years')) {
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

    // Direct string fallback match loop
    for (const key of Object.keys(this.knowledgeBase)) {
      if (query.includes(key.toLowerCase())) {
        return key;
      }
    }

    return null;
  },

  /**
   * Create and append a beautiful text bubble to the thread
   */
  addChatBubble(sender, text, topic) {
    if (!this.chatThread) return;

    const bubble = document.createElement('div');
    bubble.className = `ai-chat-bubble ai-bubble-${sender}`;

    if (sender === 'ai') {
      const contentDiv = document.createElement('div');
      contentDiv.className = 'ai-bubble-content';

      const p = document.createElement('p');
      p.innerHTML = text; // Allow rich text spans
      contentDiv.appendChild(p);

      // Pinned deflection Call/Email buttons for Communication matches
      if (topic === 'Communication' || text.includes('Get In Touch') || text.includes('directly at +91')) {
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'ai-answer-actions';
        actionsDiv.innerHTML = `
          <a href="tel:+919959629041" class="ai-answer-btn primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width: 13px; height: 13px; transform: scaleX(-1);"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            Call Sayantan
          </a>
          <a href="mailto:myprofile.sayantan@gmail.com?subject=Inquiry%20from%20Portfolio&body=Hi%20Sayantan,%0D%0A%0D%0AI%20explored%20your%20Conversational%20AI%20portfolio%20and%20would%20love%20to%20connect%20with%20you%20regarding%20UX%20opportunities!%0D%0A%0D%0ABest%20regards," class="ai-answer-btn secondary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width: 13px; height: 13px;"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            Email Sayantan
          </a>
        `;
        contentDiv.appendChild(actionsDiv);
      }

      // Automatically append subsequent suggestion chips inside AI reply bubble except Communication cards
      if (topic && topic !== 'Communication') {
        const chipsContainer = document.createElement('div');
        chipsContainer.className = 'ai-chat-chips-container';
        
        // Exclude current topic from suggestion options to prompt alternate path exploration
        const otherTopics = Object.keys(this.knowledgeBase).filter(t => t !== topic);
        const row1 = otherTopics.slice(0, 3);
        const row2 = otherTopics.slice(3, 6);
        
        let containerHTML = `<div class="ai-chat-chip-row">`;
        row1.forEach(t => {
          containerHTML += `<button class="ai-chat-chip" data-topic="${t}">${t}</button>`;
        });
        containerHTML += `</div>`;
        
        if (row2.length > 0) {
          containerHTML += `<div class="ai-chat-chip-row">`;
          row2.forEach(t => {
            containerHTML += `<button class="ai-chat-chip" data-topic="${t}">${t}</button>`;
          });
          containerHTML += `</div>`;
        }
        
        chipsContainer.innerHTML = containerHTML;
        contentDiv.appendChild(chipsContainer);
        
        // Re-bind click event listeners to new suggestion chips
        setTimeout(() => this.bindChatChips(chipsContainer), 10);
      }

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

    this.removeTypingBubble();

    const bubble = document.createElement('div');
    bubble.className = 'ai-chat-bubble ai-bubble-typing';
    bubble.id = 'ai-chat-typing-indicator';
    bubble.innerHTML = '<span></span><span></span><span></span>';

    this.chatThread.appendChild(bubble);
  },

  /**
   * Remove active typing indicators
   */
  removeTypingBubble() {
    const indicator = document.getElementById('ai-chat-typing-indicator');
    if (indicator) {
      indicator.remove();
    }
  },

  /**
   * Scroll viewport down smoothly
   */
  scrollChatToBottom() {
    if (!this.chatThread) return;
    this.chatThread.scrollTo({
      top: this.chatThread.scrollHeight,
      behavior: 'smooth'
    });
  },

  /**
   * Open the side navigation drawer menu
   */
  openMenu() {
    if (this.menuOverlay) {
      this.menuOverlay.classList.add('active');
    }
  },

  /**
   * Close the side navigation drawer menu
   */
  closeMenu() {
    if (this.menuOverlay) {
      this.menuOverlay.classList.remove('active');
    }
  }
};
