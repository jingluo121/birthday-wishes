// 等待页面加载
document.addEventListener('DOMContentLoaded', function() {
  // 获取元素
  const confettiBtn = document.getElementById('confettiBtn');
  const musicBtn = document.getElementById('musicBtn');
  const messageBtn = document.getElementById('messageBtn');
  const modal = document.getElementById('messageModal');
  const closeBtn = document.querySelector('.close');
  const music = document.getElementById('birthdayMusic');
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas.getContext('2d');

  // 设置画布尺寸
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // 飘落元素数组
  const fallingElements = [];
  const emojis = ['🎂', '🎁', '🎈', '🎊', '🎉', '💝', '🌸', '⭐', '✨', '💖'];

  // 创建飘落元素
  function createFallingElements(count = 30) {
    const container = document.querySelector('.falling-elements');

    for (let i = 0; i < count; i++) {
      const element = document.createElement('div');
      element.className = 'falling-element';
      element.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
      element.style.left = Math.random() * 100 + 'vw';
      element.style.top = -50 + 'px';
      element.style.fontSize = (Math.random() * 20 + 20) + 'px';
      element.style.opacity = Math.random() * 0.5 + 0.3;
      element.style.color = getRandomColor();

      container.appendChild(element);
      fallingElements.push({
        element: element,
        x: parseFloat(element.style.left),
        y: parseFloat(element.style.top),
        speed: Math.random() * 2 + 1,
        swing: Math.random() * 2 - 1,
        swingSpeed: Math.random() * 0.05 + 0.02
      });
    }
  }

  // 动画飘落元素
  function animateFallingElements() {
    fallingElements.forEach(item => {
      item.y += item.speed;
      item.x += Math.sin(item.y * item.swingSpeed) * item.swing;

      if (item.y > window.innerHeight) {
        item.y = -50;
        item.x = Math.random() * window.innerWidth;
      }

      item.element.style.left = item.x + 'px';
      item.element.style.top = item.y + 'px';
    });

    requestAnimationFrame(animateFallingElements);
  }

  // 获取随机颜色
  function getRandomColor() {
    const colors = ['#ff4081', '#7c4dff', '#ffeb3b', '#4caf50', '#2196f3'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // 彩色纸屑类
  class Confetti {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 10 + 5;
      this.speedX = Math.random() * 6 - 3;
      this.speedY = Math.random() * 3 + 2;
      this.color = getRandomColor();
      this.shape = Math.random() > 0.5 ? 'circle' : 'rect';
      this.rotation = Math.random() * 360;
      this.rotationSpeed = Math.random() * 10 - 5;
      this.gravity = 0.1;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.speedY += this.gravity;
      this.rotation += this.rotationSpeed;

      // 边界检查
      if (this.x > canvas.width) this.x = 0;
      if (this.x < 0) this.x = canvas.width;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation * Math.PI / 180);
      ctx.fillStyle = this.color;

      if (this.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
      }

      ctx.restore();
    }
  }

  // 彩色纸屑数组
  let confettiArray = [];

  // 创建彩色纸屑
  function createConfetti(count = 150) {
    confettiArray = [];
    for (let i = 0; i < count; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height - canvas.height;
      confettiArray.push(new Confetti(x, y));
    }
  }

  // 动画彩色纸屑
  function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < confettiArray.length; i++) {
      confettiArray[i].update();
      confettiArray[i].draw();

      // 移除超出底部的彩色纸屑
      if (confettiArray[i].y > canvas.height) {
        confettiArray.splice(i, 1);
        i--;
      }
    }

    // 持续添加新的彩色纸屑
    if (Math.random() < 0.1) {
      confettiArray.push(new Confetti(
        Math.random() * canvas.width,
        -10
      ));
    }

    requestAnimationFrame(animateConfetti);
  }

  // 触发彩色纸屑效果
  function triggerConfetti() {
    createConfetti(200);
    if (!confettiRunning) {
      confettiRunning = true;
      animateConfetti();

      // 5秒后停止
      setTimeout(() => {
        confettiRunning = false;
      }, 5000);
    }
  }

  // 音乐控制
  let musicPlaying = false;
  function toggleMusic() {
    if (musicPlaying) {
      music.pause();
      musicBtn.innerHTML = '<i class="fas fa-play"></i> 播放音乐';
      musicPlaying = false;
    } else {
      music.play().catch(e => console.log("自动播放被阻止，请点击按钮播放"));
      musicBtn.innerHTML = '<i class="fas fa-pause"></i> 暂停音乐';
      musicPlaying = true;
    }
  }

  // 显示祝福弹窗
  function showMessage() {
    modal.style.display = 'block';
  }

  // 隐藏弹窗
  function closeModal() {
    modal.style.display = 'none';
  }

  // 窗口点击关闭弹窗
  window.onclick = function(event) {
    if (event.target == modal) {
      closeModal();
    }
  }

  // 窗口调整大小时重置画布
  window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  // 事件监听
  confettiBtn.addEventListener('click', triggerConfetti);
  musicBtn.addEventListener('click', toggleMusic);
  messageBtn.addEventListener('click', showMessage);
  closeBtn.addEventListener('click', closeModal);

  // 自动播放音乐（可能需要用户交互）
  setTimeout(() => {
    music.play().then(() => {
      musicPlaying = true;
      musicBtn.innerHTML = '<i class="fas fa-pause"></i> 暂停音乐';
    }).catch(() => {
      console.log("需要用户交互才能播放音乐");
    });
  }, 1000);

  // 初始化飘落元素
  createFallingElements(40);
  animateFallingElements();

  // 自动触发一些特效
  setTimeout(triggerConfetti, 1500);

  // 控制变量
  let confettiRunning = false;
});
