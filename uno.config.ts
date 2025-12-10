/**
 * UnoCSS 配置文件 - 样式系统迁移专家配置
 * 基于 style-migration 子代理的完整指导原则
 * 支持从 ColorUI 到 UnoCSS + wot-design-uni 的完整样式迁移
 */

// https://www.npmjs.com/package/@uni-helper/unocss-preset-uni
import { presetUni } from '@uni-helper/unocss-preset-uni'
import { defineConfig, presetAttributify, presetIcons, transformerDirectives, transformerVariantGroup } from 'unocss'

export default defineConfig({
  /**
   * 预设配置
   * 包含 uni-app 适配、图标和属性化支持
   */
  presets: [
    presetUni({
      attributify: false,
    }),
    presetIcons({
      scale: 1.2,
      warn: true,
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
    }),
    // 支持css class属性化
    presetAttributify(),
  ],

  /**
   * 转换器配置
   * 支持 CSS 指令和变体组功能
   */
  transformers: [
    // 启用指令功能：主要用于支持 @apply、@screen 和 theme() 等 CSS 指令
    transformerDirectives(),
    // 启用 () 分组功能
    // 支持css class组合，eg: `<div class="hover:(bg-gray-400 font-medium) font-(light mono)">测试 unocss</div>`
    transformerVariantGroup(),
  ],

  /**
   * 主题配置 - 基于 style-migration 指导原则
   * 完整的设计令牌系统，支持 ColorUI 兼容和现代化语义
   */
  theme: {
    colors: {
      /** 主题色配置 */
      /** 主题色，用法如: text-primary */
      'primary': 'var(--wot-color-theme,#0957DE)',
      'secondary': '#1cbbb4', // 辅助色

      /** ColorUI 兼容色彩系统 */
      'colorui-blue': '#0081FF',
      'colorui-green': '#39b54a',
      'colorui-red': '#e54d42',
      'colorui-yellow': '#fbbd08',
      'colorui-orange': '#f37b1d',
      'colorui-purple': '#6739b6',
      'colorui-brown': '#a5673f',

      /** 现代化语义色彩扩展 */
      'success': '#39b54a', // 成功色
      'warning': '#fbbd08', // 警告色
      'danger': '#e54d42', // 危险色
      'info': '#909399', // 信息色

      /** 渐变色映射 */
      'gradient-green': 'linear-gradient(45deg, #39b54a, #8bc34a)',
      'gradient-blue': 'linear-gradient(45deg, #0081FF, #1cbbb4)',
      'gradient-red': 'linear-gradient(45deg, #e54d42, #ff5722)',
      'gradient-yellow': 'linear-gradient(45deg, #fbbd08, #ffc107)',
      'gradient-orange': 'linear-gradient(45deg, #f37b1d, #ff9800)',
      'gradient-purple': 'linear-gradient(45deg, #6739b6, #9c27b0)',

      /** 完整灰度色彩系统 */
      'gray': {
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827',
      },

      /** 品牌色彩扩展 */
      'brand': {
        primary: '#0081FF',
        secondary: '#1cbbb4',
        accent: '#39b54a',
      },
    },

    /** 字体尺寸配置 - uni-app rpx 单位适配 */
    fontSize: {
      // 超小字体
      '2xs': ['20rpx', '28rpx'],
      '3xs': ['18rpx', '26rpx'],

      // 适配不同平台的字体大小
      'xs': ['24rpx', '32rpx'],
      'sm': ['28rpx', '40rpx'],
      'base': ['32rpx', '44rpx'],
      'lg': ['36rpx', '48rpx'],
      'xl': ['40rpx', '52rpx'],
      '2xl': ['48rpx', '60rpx'],
      '3xl': ['56rpx', '68rpx'],
      '4xl': ['64rpx', '76rpx'],

      // ColorUI 兼容字体尺寸
      'colorui-xs': ['24rpx', '34rpx'],
      'colorui-sm': ['28rpx', '40rpx'],
      'colorui-lg': ['32rpx', '44rpx'],
      'colorui-xl': ['36rpx', '50rpx'],
    },

    /** 间距配置 - 统一间距规范 */
    spacing: {
      // uni-app 安全区域适配
      'safe-area-top': 'var(--status-bar-height)',
      'safe-area-bottom': 'var(--window-bottom)',

      // 标准间距系统
      'xs': '8rpx',
      'sm': '16rpx',
      'md': '24rpx',
      'lg': '32rpx',
      'xl': '48rpx',
      '2xl': '64rpx',
      '3xl': '96rpx',
      '4xl': '128rpx',

      // ColorUI 兼容间距
      'colorui-xs': '10rpx',
      'colorui-sm': '20rpx',
      'colorui-md': '30rpx',
      'colorui-lg': '40rpx',
      'colorui-xl': '50rpx',
    },

    /** 圆角配置 */
    borderRadius: {
      'xs': '4rpx',
      'sm': '8rpx',
      'md': '12rpx',
      'lg': '16rpx',
      'xl': '24rpx',
      '2xl': '32rpx',
      'full': '9999px',

      // ColorUI 兼容圆角
      'colorui-sm': '10rpx',
      'colorui-md': '15rpx',
      'colorui-lg': '20rpx',
      'colorui-xl': '30rpx',
      'colorui-full': '9999px',
    },

    /** 阴影配置 */
    boxShadow: {
      'xs': '0 1rpx 2rpx rgba(0,0,0,0.05)',
      'sm': '0 1rpx 3rpx rgba(0,0,0,0.1)',
      'md': '0 4rpx 6rpx rgba(0,0,0,0.1)',
      'lg': '0 10rpx 15rpx rgba(0,0,0,0.1)',
      'xl': '0 20rpx 25rpx rgba(0,0,0,0.1)',
      '2xl': '0 25rpx 50rpx rgba(0,0,0,0.25)',

      // ColorUI 兼容阴影
      'colorui-sm': '0 1rpx 6rpx rgba(0,0,0,0.1)',
      'colorui-md': '0 1rpx 10rpx rgba(0,0,0,0.1)',
      'colorui-lg': '0 1rpx 20rpx rgba(0,0,0,0.1)',
      'colorui-blur': '0 4rpx 16rpx rgba(0,0,0,0.15)',
    },
  },

  /**
   * 自定义规则 - 扩展功能
   * 提供原生 UnoCSS 不支持的特殊样式规则
   */
  rules: [
    /** 安全区域适配规则 */
    [
      'p-safe',
      {
        padding:
					'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)',
      },
    ],
    ['pt-safe', { 'padding-top': 'env(safe-area-inset-top)' }],
    ['pb-safe', { 'padding-bottom': 'env(safe-area-inset-bottom)' }],
    ['pl-safe', { 'padding-left': 'env(safe-area-inset-left)' }],
    ['pr-safe', { 'padding-right': 'env(safe-area-inset-right)' }],

    /** 自定义动画规则 */
    [
      'animate-fade-in',
      {
        animation: 'fadeIn 0.3s ease-in-out',
      },
    ],
    [
      'animate-slide-up',
      {
        animation: 'slideUp 0.3s ease-out',
      },
    ],
    [
      'animate-bounce-in',
      {
        animation: 'bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
    ],
    [
      'animate-scale-in',
      {
        animation: 'scaleIn 0.2s ease-out',
      },
    ],
    [
      'animate-spin-slow',
      {
        animation: 'spin 2s linear infinite',
      },
    ],
    [
      'animate-pulse-once',
      {
        animation: 'pulseOnce 0.3s ease-in-out',
      },
    ],
    [
      'animate-float',
      {
        animation: 'float 3s ease-in-out infinite',
      },
    ],
    [
      'animate-shine',
      {
        animation: 'shine 2s ease-in-out infinite',
      },
    ],

    /** 自定义渐变背景规则 */
    [
      /^bg-gradient-(.+)$/,
      ([, c]) => {
        const gradients: Record<string, string> = {
          blue: 'linear-gradient(45deg, #0081FF, #1cbbb4)',
          green: 'linear-gradient(45deg, #39b54a, #8bc34a)',
          red: 'linear-gradient(45deg, #e54d42, #ff5722)',
          yellow: 'linear-gradient(45deg, #fbbd08, #ffc107)',
          purple: 'linear-gradient(45deg, #6739b6, #9c27b0)',
          orange: 'linear-gradient(45deg, #f37b1d, #ff9800)',
        }
        if (gradients[c]) {
          return { background: gradients[c] }
        }
      },
    ],

    /** 自定义间距规则 - rpx 单位支持 */
    [/^m-(\d+)rpx$/, ([, d]) => ({ margin: `${d}rpx` })],
    [/^p-(\d+)rpx$/, ([, d]) => ({ padding: `${d}rpx` })],
    [/^mt-(\d+)rpx$/, ([, d]) => ({ 'margin-top': `${d}rpx` })],
    [/^mb-(\d+)rpx$/, ([, d]) => ({ 'margin-bottom': `${d}rpx` })],
    [/^ml-(\d+)rpx$/, ([, d]) => ({ 'margin-left': `${d}rpx` })],
    [/^mr-(\d+)rpx$/, ([, d]) => ({ 'margin-right': `${d}rpx` })],
    [/^pt-(\d+)rpx$/, ([, d]) => ({ 'padding-top': `${d}rpx` })],
    [/^pb-(\d+)rpx$/, ([, d]) => ({ 'padding-bottom': `${d}rpx` })],
    [/^pl-(\d+)rpx$/, ([, d]) => ({ 'padding-left': `${d}rpx` })],
    [/^pr-(\d+)rpx$/, ([, d]) => ({ 'padding-right': `${d}rpx` })],

    /** 自定义尺寸规则 - rpx 单位支持 */
    [/^w-(\d+)rpx$/, ([, d]) => ({ width: `${d}rpx` })],
    [/^h-(\d+)rpx$/, ([, d]) => ({ height: `${d}rpx` })],
    [/^text-(\d+)rpx$/, ([, d]) => ({ 'font-size': `${d}rpx` })],
    [/^leading-(\d+)rpx$/, ([, d]) => ({ 'line-height': `${d}rpx` })],

    /** 自定义圆角规则 - rpx 单位支持 */
    [/^rounded-(\d+)rpx$/, ([, d]) => ({ 'border-radius': `${d}rpx` })],
  ],

  /**
   * 安全列表 - 确保动态图标和类名被包含
   * 防止动态生成的类名被 PurgeCSS 误删
   */
  safelist: [
    // 图标安全列表
    'i-carbon-code',
    'i-carbon-search',
    'i-carbon-phone',
    'i-carbon-user',
    'i-carbon-home',
    'i-carbon-settings',
    'i-carbon-building',
    'i-carbon-grid',
    'i-carbon-time',
    'i-carbon-trash-can',
    'i-carbon-arrow-up',
    'i-carbon-arrow-left',
    'i-carbon-warning',
    'i-carbon-checkmark',
    'i-carbon-add',
    'i-carbon-checkmark-filled',
    'i-carbon-chevron-right',

    // 动态类名安全列表
    'text-primary',
    'bg-primary',
    'border-primary',

    // 状态类名
    'loading',
    'success',
    'error',
    'warning',
  ],

  /**
   * 自定义 CSS - 动画定义
   * 全局样式和动画 keyframes 定义
   */
  preflights: [
    {
      getCSS: () => `
        /* 自定义动画定义 */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes bounceIn {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); opacity: 0.8; }
          70% { transform: scale(0.9); opacity: 0.9; }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        @keyframes pulseOnce {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes shine {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        /* 全局样式重置 */
        *, *::before, *::after {
          box-sizing: border-box;
        }

        /* 滚动条样式 */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }

        /* 优化 tap 高亮 */
        * {
          -webkit-tap-highlight-color: transparent;
        }
      `,
    },
  ],
})
