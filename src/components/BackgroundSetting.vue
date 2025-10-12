<template>
  <div class="background-setting">
    <h2>设置背景图</h2>

    <!-- 主页背景设置 -->
    <div class="setting-section">
      <h3>主页背景</h3>
      
      <!-- 透明度控制 -->
      <div class="opacity-control" v-if="mainImageUrl">
        <label>透明度: {{ mainOpacity }}%</label>
        <input type="range" min="0" max="100" v-model="mainOpacity" @input="updateMainPreview">
      </div>

      <div class="upload-area">
        <label for="main-upload" class="upload-label">
          <i class="fas fa-upload"></i>
          <span>上传主页背景图</span>
          <input type="file" id="main-upload" accept="image/*" @change="handleMainUpload" class="upload-input"/>
        </label>
      </div>

      <!-- 主页裁剪区域 -->
      <div class="crop-section" v-if="mainImageUrl">
        <h4>主页背景裁剪 (拖动选择区域)</h4>
        <div class="crop-container">
          <div class="image-wrapper">
            <div class="image-container">
              <img :src="mainImageUrl" ref="mainImage" @load="initMainCrop" class="crop-image"/>
              <div class="crop-box" 
                   :style="mainCropStyle"
                   @mousedown="startDrag('main', $event)"
                   @touchstart="startDrag('main', $event)">
                <div class="crop-handle"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="crop-controls">
          <button @click="resetMainCrop" class="control-btn">重置</button>
          <button @click="centerMainCrop" class="control-btn">居中</button>
        </div>
      </div>

      <div class="preview" v-if="mainImageUrl">
        <h4>主页预览</h4>
        <div class="main-preview-box">
          <div class="preview-frame">
            <div class="preview-content" :style="mainPreviewStyle">
              <div class="preview-header">任务清单头部</div>
              <div class="preview-task">示例任务内容</div>
              <div class="preview-footer">底部统计</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 导航栏背景设置 -->
    <div class="setting-section">
      <h3>导航栏背景</h3>
      
      <!-- 透明度控制 -->
      <div class="opacity-control" v-if="navImageUrl">
        <label>透明度: {{ navOpacity }}%</label>
        <input type="range" min="0" max="100" v-model="navOpacity" @input="updateNavPreview">
      </div>

      <div class="upload-area">
        <label for="nav-upload" class="upload-label">
          <i class="fas fa-upload"></i>
          <span>上传导航栏背景图</span>
          <input type="file" id="nav-upload" accept="image/*" @change="handleNavUpload" class="upload-input"/>
        </label>
      </div>

      <!-- 导航栏裁剪区域 -->
      <div class="crop-section" v-if="navImageUrl">
        <h4>导航栏背景裁剪 (拖动选择区域)</h4>
        <div class="crop-container">
          <div class="image-wrapper">
            <div class="image-container">
              <img :src="navImageUrl" ref="navImage" @load="initNavCrop" class="crop-image"/>
              <div class="crop-box" 
                   :style="navCropStyle"
                   @mousedown="startDrag('nav', $event)"
                   @touchstart="startDrag('nav', $event)">
                <div class="crop-handle"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="crop-controls">
          <button @click="resetNavCrop" class="control-btn">重置</button>
          <button @click="centerNavCrop" class="control-btn">居中</button>
        </div>
      </div>

      <div class="preview" v-if="navImageUrl">
        <h4>导航栏预览</h4>
        <div class="nav-preview-box">
          <div class="preview-frame">
            <div class="nav-preview-content" :style="navPreviewStyle">
              <div class="nav-preview-logo">Logo</div>
              <div class="nav-preview-links">
                <span>任务</span>
                <span>背景图</span>
                <span>关于</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 提交按钮 -->
    <div class="submit-section">
      <button class="submit-btn" @click="cropAndSave">
        <i class="fas fa-check"></i> 裁剪并保存
      </button>
      <button class="cancel-btn" @click="$router.push('/')">
        <i class="fas fa-times"></i> 取消
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 主页相关
      mainImageUrl: '',
      mainImageElement: null,
      mainCrop: { x: 0, y: 0, width: 0, height: 0 },
      mainCroppedImage: '',
      mainIsDragging: false,
      mainStartX: 0,
      mainStartY: 0,
      mainStartCrop: null,
      mainOpacity: 80,
      mainScale: 1,

      // 导航栏相关
      navImageUrl: '',
      navImageElement: null,
      navCrop: { x: 0, y: 0, width: 0, height: 0 },
      navCroppedImage: '',
      navIsDragging: false,
      navStartX: 0,
      navStartY: 0,
      navStartCrop: null,
      navOpacity: 80,
      navScale: 1,

      // 固定尺寸
      previewSizes: {
        main: { width: 400, height: 500 },    // 预览框尺寸
        actual: { width: 800, height: 1000 }, // 实际背景尺寸
        navPreview: { width: 400, height: 60 },
        navActual: { width: 800, height: 100 }
      }
    }
  },
  computed: {
    mainCropStyle() {
      return {
        left: `${this.mainCrop.x}px`,
        top: `${this.mainCrop.y}px`,
        width: `${this.mainCrop.width}px`,
        height: `${this.mainCrop.height}px`
      }
    },
    navCropStyle() {
      return {
        left: `${this.navCrop.x}px`,
        top: `${this.navCrop.y}px`,
        width: `${this.navCrop.width}px`,
        height: `${this.navCrop.height}px`
      }
    },
    mainPreviewStyle() {
      if (!this.mainCroppedImage) return {};
      
      // 计算缩放比例：预览框尺寸 / 实际背景尺寸
      const scaleX = this.previewSizes.main.width / this.previewSizes.actual.width;
      const scaleY = this.previewSizes.main.height / this.previewSizes.actual.height;
      const scale = Math.min(scaleX, scaleY) * 0.9; // 90% 缩放，留出边距
      
      return {
        backgroundImage: `url(${this.mainCroppedImage})`,
        backgroundSize: `${this.previewSizes.actual.width * scale}px ${this.previewSizes.actual.height * scale}px`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        opacity: this.mainOpacity / 100
      }
    },
    navPreviewStyle() {
      if (!this.navCroppedImage) return {};
      
      const scaleX = this.previewSizes.navPreview.width / this.previewSizes.navActual.width;
      const scaleY = this.previewSizes.navPreview.height / this.previewSizes.navActual.height;
      const scale = Math.min(scaleX, scaleY) * 0.9;
      
      return {
        backgroundImage: `url(${this.navCroppedImage})`,
        backgroundSize: `${this.previewSizes.navActual.width * scale}px ${this.previewSizes.navActual.height * scale}px`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        opacity: this.navOpacity / 100
      }
    }
  },
  mounted() {
    this.loadSavedSettings();
    document.addEventListener('mousemove', this.handleDrag);
    document.addEventListener('mouseup', this.stopDrag);
    document.addEventListener('touchmove', this.handleDrag);
    document.addEventListener('touchend', this.stopDrag);
  },
  beforeDestroy() {
    document.removeEventListener('mousemove', this.handleDrag);
    document.removeEventListener('mouseup', this.stopDrag);
    document.removeEventListener('touchmove', this.handleDrag);
    document.removeEventListener('touchend', this.stopDrag);
  },
  methods: {
    loadSavedSettings() {
      const mainBg = localStorage.getItem('mainBackground');
      const navBg = localStorage.getItem('navBackground');
      const mainOpacity = localStorage.getItem('mainOpacity');
      const navOpacity = localStorage.getItem('navOpacity');
      
      if (mainBg) {
        this.mainImageUrl = mainBg;
        this.mainCroppedImage = mainBg;
      }
      if (navBg) {
        this.navImageUrl = navBg;
        this.navCroppedImage = navBg;
      }
      if (mainOpacity) this.mainOpacity = parseInt(mainOpacity);
      if (navOpacity) this.navOpacity = parseInt(navOpacity);
    },

    handleMainUpload(e) {
      this.handleUpload(e, 'main');
    },

    handleNavUpload(e) {
      this.handleUpload(e, 'nav');
    },

    handleUpload(e, type) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (type === 'main') {
            this.mainImageUrl = e.target.result;
            this.mainOpacity = 80; // 重置透明度
          } else {
            this.navImageUrl = e.target.result;
            this.navOpacity = 80;
          }
        };
        reader.readAsDataURL(file);
      }
    },

    initMainCrop() {
      this.mainImageElement = this.$refs.mainImage;
      if (this.mainImageElement) {
        const img = this.mainImageElement;
        const containerWidth = 600; // 裁剪容器宽度
        
        // 计算图片在容器中的缩放比例
        this.mainScale = containerWidth / img.naturalWidth;
        const scaledHeight = img.naturalHeight * this.mainScale;
        
        // 设置裁剪框尺寸（按实际背景比例 800:1000 = 4:5）
        const cropWidth = containerWidth * 0.8;
        const cropHeight = cropWidth * (5/4);
        
        // 居中放置裁剪框
        this.mainCrop = {
          x: (containerWidth - cropWidth) / 2,
          y: (scaledHeight - cropHeight) / 2,
          width: cropWidth,
          height: cropHeight
        };
      }
    },

    initNavCrop() {
      this.navImageElement = this.$refs.navImage;
      if (this.navImageElement) {
        const img = this.navImageElement;
        const containerWidth = 600;
        
        this.navScale = containerWidth / img.naturalWidth;
        const scaledHeight = img.naturalHeight * this.navScale;
        
        // 导航栏比例 800:100 = 8:1
        const cropWidth = containerWidth * 0.8;
        const cropHeight = cropWidth * (1/8);
        
        this.navCrop = {
          x: (containerWidth - cropWidth) / 2,
          y: (scaledHeight - cropHeight) / 2,
          width: cropWidth,
          height: cropHeight
        };
      }
    },

    centerMainCrop() {
      if (this.mainImageElement) {
        const img = this.mainImageElement;
        const scaledHeight = img.naturalHeight * this.mainScale;
        
        this.mainCrop.x = (600 - this.mainCrop.width) / 2;
        this.mainCrop.y = (scaledHeight - this.mainCrop.height) / 2;
      }
    },

    centerNavCrop() {
      if (this.navImageElement) {
        const img = this.navImageElement;
        const scaledHeight = img.naturalHeight * this.navScale;
        
        this.navCrop.x = (600 - this.navCrop.width) / 2;
        this.navCrop.y = (scaledHeight - this.navCrop.height) / 2;
      }
    },

    startDrag(type, e) {
      e.preventDefault();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      
      if (type === 'main') {
        this.mainIsDragging = true;
        this.mainStartX = clientX;
        this.mainStartY = clientY;
        this.mainStartCrop = { ...this.mainCrop };
      } else {
        this.navIsDragging = true;
        this.navStartX = clientX;
        this.navStartY = clientY;
        this.navStartCrop = { ...this.navCrop };
      }
    },

    handleDrag(e) {
      if (!this.mainIsDragging && !this.navIsDragging) return;
      
      e.preventDefault();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      
      if (this.mainIsDragging) {
        const deltaX = clientX - this.mainStartX;
        const deltaY = clientY - this.mainStartY;
        
        const img = this.mainImageElement;
        const scaledHeight = img.naturalHeight * this.mainScale;
        const maxX = 600 - this.mainCrop.width;
        const maxY = scaledHeight - this.mainCrop.height;
        
        this.mainCrop.x = Math.max(0, Math.min(this.mainStartCrop.x + deltaX, maxX));
        this.mainCrop.y = Math.max(0, Math.min(this.mainStartCrop.y + deltaY, maxY));
      }
      
      if (this.navIsDragging) {
        const deltaX = clientX - this.navStartX;
        const deltaY = clientY - this.navStartY;
        
        const img = this.navImageElement;
        const scaledHeight = img.naturalHeight * this.navScale;
        const maxX = 600 - this.navCrop.width;
        const maxY = scaledHeight - this.navCrop.height;
        
        this.navCrop.x = Math.max(0, Math.min(this.navStartCrop.x + deltaX, maxX));
        this.navCrop.y = Math.max(0, Math.min(this.navStartCrop.y + deltaY, maxY));
      }
    },

    stopDrag() {
      this.mainIsDragging = false;
      this.navIsDragging = false;
    },

    resetMainCrop() {
      this.initMainCrop();
    },

    resetNavCrop() {
      this.initNavCrop();
    },

    updateMainPreview() {
      if (this.mainImageElement && this.mainImageUrl) {
        this.cropImage('main').then(croppedUrl => {
          this.mainCroppedImage = croppedUrl;
        });
      }
    },

    updateNavPreview() {
      if (this.navImageElement && this.navImageUrl) {
        this.cropImage('nav').then(croppedUrl => {
          this.navCroppedImage = croppedUrl;
        });
      }
    },

    cropAndSave() {
      // 裁剪主页图片
      if (this.mainImageElement && this.mainImageUrl) {
        this.cropImage('main').then(croppedUrl => {
          this.mainCroppedImage = croppedUrl;
          localStorage.setItem('mainBackground', croppedUrl);
          localStorage.setItem('mainOpacity', this.mainOpacity);
        });
      }
      
      // 裁剪导航栏图片
      if (this.navImageElement && this.navImageUrl) {
        this.cropImage('nav').then(croppedUrl => {
          this.navCroppedImage = croppedUrl;
          localStorage.setItem('navBackground', croppedUrl);
          localStorage.setItem('navOpacity', this.navOpacity);
        });
      }
      
      alert('背景设置修改成功！');
      this.$router.push('/');
    },

    cropImage(type) {
      return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        let imageElement, crop, scale, targetSize;
        if (type === 'main') {
          imageElement = this.mainImageElement;
          crop = this.mainCrop;
          scale = this.mainScale;
          targetSize = this.previewSizes.actual;
        } else {
          imageElement = this.navImageElement;
          crop = this.navCrop;
          scale = this.navScale;
          targetSize = this.previewSizes.navActual;
        }
        
        canvas.width = targetSize.width;
        canvas.height = targetSize.height;
        
        // 计算实际裁剪区域（反向缩放）
        const actualCropX = crop.x / scale;
        const actualCropY = crop.y / scale;
        const actualCropWidth = crop.width / scale;
        const actualCropHeight = crop.height / scale;
        
        // 绘制裁剪后的图片
        ctx.drawImage(
          imageElement,
          actualCropX, actualCropY, actualCropWidth, actualCropHeight, // 源图像区域（实际像素）
          0, 0, targetSize.width, targetSize.height                    // 目标canvas区域
        );
        
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      });
    }
  }
}
</script>

<style scoped>
.background-setting {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.setting-section {
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #eee;
}

.opacity-control {
  margin: 1rem 0;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 4px;
}

.opacity-control label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.opacity-control input {
  width: 100%;
}

.upload-label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1.5rem;
  border: 2px dashed #ccc;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.upload-label:hover {
  border-color: #42b983;
  background: #fafafa;
}

.upload-input {
  display: none;
}

.crop-section {
  margin: 1.5rem 0;
}

.crop-container {
  width: 100%;
  max-width: 600px;
  margin: 1rem auto;
  position: relative;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  background: #f9f9f9;
}

.image-wrapper {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.image-container {
  position: relative;
  display: inline-block;
  max-width: 100%;
}

.crop-image {
  max-width: 100%;
  height: auto;
  display: block;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.crop-box {
  position: absolute;
  border: 2px solid #42b983;
  background: rgba(66, 185, 131, 0.2);
  cursor: move;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.3);
}

.crop-handle {
  position: absolute;
  bottom: -5px;
  right: -5px;
  width: 15px;
  height: 15px;
  background: #42b983;
  border-radius: 50%;
  cursor: se-resize;
}

.crop-controls {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin: 1rem 0;
}

.control-btn {
  padding: 0.5rem 1rem;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.control-btn:hover {
  background: #e9e9e9;
}

/* 预览样式 - 相框效果 */
.main-preview-box,
.nav-preview-box {
  display: flex;
  justify-content: center;
  margin: 1rem 0;
}

.preview-frame {
  border: 15px solid #f0f0f0;
  border-radius: 8px;
  background: white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.main-preview-box .preview-frame {
  width: 400px;
  height: 500px;
}

.nav-preview-box .preview-frame {
  width: 400px;
  height: 60px;
}

.preview-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: rgba(255,255,255,0.1);
}

.preview-header,
.preview-footer {
  background: rgba(255,255,255,0.8);
  padding: 1rem;
  text-align: center;
  font-weight: bold;
  border-bottom: 1px solid #eee;
}

.preview-task {
  flex: 1;
  background: rgba(255,255,255,0.6);
  margin: 1rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #ddd;
}

.nav-preview-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  background: rgba(255,255,255,0.1);
  font-weight: bold;
}

.nav-preview-logo {
  font-weight: bold;
}

.nav-preview-links {
  display: flex;
  gap: 1rem;
}

.submit-section {
  text-align: center;
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.submit-btn {
  padding: 0.8rem 2rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.submit-btn:hover {
  background-color: #359e6d;
}

.cancel-btn {
  padding: 0.8rem 2rem;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.cancel-btn:hover {
  background-color: #545b62;
}
</style>