import InputCurrencyTemplate from '@/components/common/InputCurrencyTemplate.vue'
import { VueTestUtils } from 'cypress/vue'

before(() => {
  VueTestUtils.config.global.components = { InputCurrencyTemplate }
})

after(() => {
  VueTestUtils.config.global.components = {}
})

describe('InputCurrencyTemplate', () => {
  it('Typing 50.5', () => {
    cy.mount({
      setup() {
        return {
          model: ref(''),
        }
      },
      template: `
        <InputCurrencyTemplate v-model="model" />
        <span>Value: {{ model }}</span>
      `,
    })

    cy.get('input').type('50.5')
    cy.contains('Value: 50.5')
  })

  it('Typing non-numeric characters - they are filtered out', () => {
    cy.mount({
      setup() {
        return {
          model: ref(''),
        }
      },
      template: `
        <InputCurrencyTemplate v-model="model" />
        <span>Value: {{ model || '<none>' }}</span>
      `,
    })

    cy.get('input').type('aaa')
    cy.contains('Value: <none>')

    cy.get('input').clear().type('43')
    cy.contains('Value: 43')

    cy.get('input').type('...').should('have.value', '43...')
    cy.contains('Value: 43')

    cy.get('input').clear().type('12.414')
    cy.contains('Value: 12.414')

    cy.get('input').type('fas')
    cy.contains('Value: 12.414')
  })

  it('"right" slot is enabled by prop', () => {
    cy.mount({
      template: `
        <InputCurrencyTemplate right>
          <template #right>
            <span>Chu!</span>
          </template>
        </InputCurrencyTemplate>
      `,
    })

    cy.contains('Chu!')
  })

  it('input numeric filtering is disabled when prop is set', () => {
    cy.mount({
      setup() {
        return {
          model: ref(''),
        }
      },
      template: `
        <InputCurrencyTemplate v-model="model" no-input-filter />
        <span>Value: {{ model || '<none>' }}</span>
      `,
    })

    cy.get('input').type('fas')
    cy.contains('Value: fas')
  })
})