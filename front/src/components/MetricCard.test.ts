import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MetricCard from './MetricCard.vue'

describe('MetricCard', () => {
  it('renders title and value', () => {
    const wrapper = mount(MetricCard, {
      props: { title: 'CPU', value: '12%' },
    })
    expect(wrapper.text()).toContain('CPU')
    expect(wrapper.text()).toContain('12%')
  })

  it('renders a progress bar sized to the percent, capped at 100', () => {
    const wrapper = mount(MetricCard, {
      props: { title: 'Disque', value: '120%', percent: 120 },
    })
    const fill = wrapper.find('.bar-fill')
    expect(fill.attributes('style')).toContain('width: 100%')
  })

  it('does not render a progress bar when percent is omitted', () => {
    const wrapper = mount(MetricCard, {
      props: { title: 'Uptime', value: '3j 4h' },
    })
    expect(wrapper.find('.bar').exists()).toBe(false)
  })
})
