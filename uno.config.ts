import {
  defineConfig,
  presetUno,
  presetAttributify,
  presetIcons
} from 'unocss'
import transformerDirectives from '@unocss/transformer-directives'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle'
      }
    })
  ],
  transformers: [
    transformerDirectives()
  ],
  shortcuts: {
    'flex-center': 'flex items-center justify-center',
    'flex-between': 'flex items-center justify-between',
    'flex-col-center': 'flex flex-col items-center justify-center',
    'text-ellipsis': 'overflow-hidden text-ellipsis whitespace-nowrap',
    'card-bg': 'bg-[#0d1f3c] border border-[#1a3a5c] rounded-lg',
    'glass-bg': 'bg-[rgba(13,31,60,0.8)] backdrop-blur-md border border-[rgba(26,58,92,0.6)] rounded-lg',
    'glow-text': 'text-[#00d4ff] text-shadow-[0_0_10px_rgba(0,212,255,0.5)]',
    'gradient-text': 'bg-gradient-to-r from-[#00d4ff] to-[#722ed1] bg-clip-text text-transparent'
  },
  theme: {
    colors: {
      primary: '#1890ff',
      accent: '#00d4ff',
      purple: '#722ed1',
      warning: '#fa8c16',
      danger: '#f5222d',
      success: '#52c41a',
      dark: {
        bg: '#0a1628',
        card: '#0d1f3c',
        border: '#1a3a5c'
      }
    }
  }
})
