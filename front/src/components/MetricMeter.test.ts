import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MetricMeter from './MetricMeter.vue'

describe('MetricMeter', () => {
  it('sizes the fill to the percent', () => {
    const wrapper = mount(MetricMeter, { props: { percent: 42 } })
    expect(wrapper.find('.fill').attributes('style')).toContain('width: 42%')
  })

  it('caps the fill width at 100%', () => {
    const wrapper = mount(MetricMeter, { props: { percent: 130 } })
    expect(wrapper.find('.fill').attributes('style')).toContain('width: 100%')
  })

  it('applies the critical class past the critical threshold', () => {
    const wrapper = mount(MetricMeter, { props: { percent: 95 } })
    expect(wrapper.find('.fill').classes()).toContain('critical')
  })
})
