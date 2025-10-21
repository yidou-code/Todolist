<template>
  <!-- 使用 v-show 而不是 v-if，避免 DOM 重新创建 -->
  <div v-show="modal.visible" class="anime-modal-overlay" @click.self="handleOverlayClick">
    <div class="anime-modal-container" :class="[modal.theme, modal.character]">
      <!-- 宠物角色区域 -->
      <div class="pet-character" :class="modal.character">
        <div class="pet-animation">
          <i :class="['pet-icon', modal.icon]"></i>
        </div>
      </div>
      
      <!-- 弹窗内容 -->
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title" v-html="modal.title"></h3>
        </div>
        
        <div class="modal-body">
          <div class="message-content" v-html="modal.message"></div>
        </div>
        
        <div class="modal-footer">
          <!-- 对于 confirm 类型，显示两个按钮 -->
          <template v-if="modal.type === 'confirm'">
            <button 
              class="anime-btn btn-cancel" 
              @click.stop="handleCancel"
            >
              <i class="bi bi-paw"></i>
              {{ modal.cancelText || '取消' }}
            </button>
            <button 
              class="anime-btn btn-confirm" 
              @click.stop="handleConfirm"
              :class="{ 'btn-danger': modal.isDanger }"
            >
              <i class="bi bi-paw"></i>
              {{ modal.confirmText || '确定' }}
            </button>
          </template>
          
          <!-- 对于 alert 类型，只显示一个按钮 -->
          <template v-else>
            <button 
              class="anime-btn btn-confirm" 
              @click.stop="handleConfirm"
              :class="{ 'btn-danger': modal.isDanger }"
            >
              <i class="bi bi-paw"></i>
              {{ modal.confirmText || '确定' }}
            </button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModalManager',
  data() {
    return {
     modal: {
        visible: false,
        title: '',
        message: '',
        type: 'alert',
        theme: 'cute',
        character: 'cat',
        icon: 'bi bi-emoji-smile',
        confirmText: '确定',
        cancelText: '取消',
        isDanger: false,
        onConfirm: null,
        onCancel: null
      }
    }
  },
  mounted() {
    this.$eventBus.$on('showAnimeModal', this.showModal);
  },
  beforeDestroy() {
    this.$eventBus.$off('showAnimeModal', this.showModal);
  },
  methods: {
     showModal(options) {
      console.log('=== 显示弹窗 ===', options);
      
      // 如果当前有弹窗显示，先完全关闭它
      if (this.modal.visible) {
        this.modal.visible = false;
        
        // 等待关闭动画完成后再显示新弹窗
        setTimeout(() => {
          this.setNewModal(options);
        }, 300); // 与关闭动画时间一致
      } else {
        // 直接显示新弹窗
        this.setNewModal(options);
      }
    },
    
    setNewModal(options) {
      this.modal = {
        visible: true,
        title: options.title || '',
        message: options.message || '',
        type: options.type || 'alert',
        theme: options.theme || 'cute',
        character: options.character || 'cat',
        icon: options.icon || 'bi bi-emoji-smile',
        confirmText: options.confirmText || '确定',
        cancelText: options.cancelText || '取消',
        isDanger: options.isDanger || false,
        onConfirm: options.onConfirm || null,
        onCancel: options.onCancel || null
      };
      console.log('新弹窗已设置');
    },
    
    handleConfirm() {
      console.log('=== 用户点击了确认按钮 ===');
      if (this.modal.onConfirm && typeof this.modal.onConfirm === 'function') {
        console.log('执行确认回调');
        this.modal.onConfirm();
      }
      this.closeModal();
    },
    
    handleCancel() {
      console.log('=== 用户点击了取消按钮 ===');
      if (this.modal.onCancel && typeof this.modal.onCancel === 'function') {
        console.log('执行取消回调');
        this.modal.onCancel();
      }
      this.closeModal();
    },
    
    closeModal() {
      console.log('关闭弹窗');
      this.modal.visible = false;
    },
    
    handleOverlayClick() {
      console.log('点击了遮罩层');
      if (this.modal.type === 'alert') {
        this.closeModal();
      }
    }
  }
  }
</script>

<style scoped>
.anime-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: overlayFadeIn 0.3s ease;
}

.anime-modal-container {
  background: white;
  border-radius: 20px;
  padding: 0;
  max-width: 450px;
  width: 90%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  animation: modalBounceIn 0.5s ease;
  display: flex;
  overflow: hidden;
  position: relative;
}

/* 宠物角色区域 */
.pet-character {
  width: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  position: relative;
}

.pet-animation {
  position: relative;
  animation: petFloat 3s ease-in-out infinite;
}

.pet-icon {
  font-size: 4rem;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
}

/* 不同宠物的颜色 */
.pet-character.cat .pet-icon {
  color: #ff9ff3;
}

.pet-character.dog .pet-icon {
  color: #ff9f43;
}

.pet-character.rabbit .pet-icon {
  color: #74b9ff;
}

.pet-character.panda .pet-icon {
  color: #636e72;
}

.pet-character.fox .pet-icon {
  color: #e17055;
}

/* 弹窗内容区域 */
.modal-content {
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
}

.modal-header {
  margin-bottom: 1rem;
}

.modal-title {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
  background: linear-gradient(135deg, #ff9ff3, #f368e0);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.modal-body {
  flex: 1;
  margin-bottom: 1.5rem;
}

.message-content {
  line-height: 1.6;
  font-size: 1rem;
  color: #666;
}

.modal-footer {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.anime-btn {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  min-width: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;
}

.anime-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  transition: left 0.5s;
}

.anime-btn:hover::before {
  left: 100%;
}

.btn-confirm {
  background: linear-gradient(135deg, #ff9ff3, #f368e0);
  color: white;
  box-shadow: 0 4px 15px rgba(255, 159, 243, 0.3);
}

.btn-confirm:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 159, 243, 0.4);
}

.btn-cancel {
  background: linear-gradient(135deg, #dfe6e9, #b2bec3);
  color: #636e72;
}

.btn-cancel:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(178, 190, 195, 0.3);
}

.btn-danger {
  background: linear-gradient(135deg, #ff7675, #d63031);
}

.btn-danger:hover {
  box-shadow: 0 6px 20px rgba(255, 118, 117, 0.4);
}

/* 主题样式 */
.anime-modal-container.cute {
  background: linear-gradient(135deg, #ffeaa7, #fab1a0);
}

.anime-modal-container.tech {
  background: linear-gradient(135deg, #74b9ff, #0984e3);
}

.anime-modal-container.warning {
  background: linear-gradient(135deg, #fdcb6e, #e17055);
}

/* 动画 */
@keyframes overlayFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes modalBounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3) translateY(100px);
  }
  50% {
    opacity: 1;
    transform: scale(1.05) translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes petFloat {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  33% {
    transform: translateY(-10px) rotate(5deg);
  }
  66% {
    transform: translateY(5px) rotate(-3deg);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .anime-modal-container {
    flex-direction: column;
    max-width: 350px;
  }
  
  .pet-character {
    width: 100%;
    padding: 1rem;
  }
  
  .pet-icon {
    font-size: 3rem;
  }
  
  .modal-content {
    padding: 1.5rem;
  }
  
  .modal-footer {
    flex-direction: column;
  }
  
  .anime-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .anime-modal-container {
    margin: 1rem;
  }
  
  .modal-content {
    padding: 1rem;
  }
}
</style>