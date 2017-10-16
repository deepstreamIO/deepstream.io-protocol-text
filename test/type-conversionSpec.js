import { convertTyped } from '../src/message-parser'
import { typed as toTyped } from '../src/message-builder'

describe('type conversion', () => {
	describe('variable types are serialized and deserialized correctly', () => {

	  it('processes strings correctly', () => {
	    expect(convertTyped('SWolfram')).toBe('Wolfram')
	  })

	  it('processes objects correctly', () => {
	    expect(convertTyped(
	      'O{"firstname":"Wolfram"}')).toEqual({ firstname: 'Wolfram' }
	    )
	  })

	  it('processes arrays correctly', () => {
	    expect(convertTyped('O["a","b","c"]')).toEqual(['a', 'b', 'c'])
	  })

	  it('processes integers correctly', () => {
	    expect(convertTyped('N42')).toBe(42)
	  })

	  it('processes floats correctly', () => {
	    expect(convertTyped('N0.543')).toBe(0.543)
	  })

	  it('processes null values correctly', () => {
	    expect(convertTyped('L')).toBe(null)
	  })

	  it('processes Boolean true correctly', () => {
	    expect(convertTyped('T')).toBe(true)
	  })

	  it('processes Boolean false correctly', () => {
	    expect(convertTyped('F')).toBe(false)
	  })

	  it('processes undefined correctly', () => {
	    expect(convertTyped('U')).toBe(undefined)
	  })

	  // Errors
	  it('handles invalid JSON', () => {
	    expect(convertTyped('O{"firstname""Wolfram"}') instanceof Error).toBe(true)
	  })

	  it('handles unknown types', () => {
	    expect(convertTyped('Qxxx') instanceof Error).toBe(true)
	  })

	  it('throws errors for unknown types', () => {
	    expect(() => {
	      typed(() => {})
	    }).toThrow()
	  })
	})

	describe('variable types are serialized and deserialized correctly', () => {
	  it('processes strings correctly', () => {
	    const input = 'Wolfram'
	    const typed = toTyped(input)

	    expect(typed).toBe('SWolfram')
	    expect(convertTyped(typed)).toBe(input)
	  })

	  it('processes objects correctly', () => {
	    const input = { firstname: 'Wolfram' }
	    const typed = toTyped(input)

	    expect(typed).toBe('O{"firstname":"Wolfram"}')
	    expect(convertTyped(typed)).toEqual(input)
	  })

	  it('processes arrays correctly', () => {
	    const input = ['a', 'b', 'c']
	    const typed = toTyped(input)

	    expect(typed).toBe('O["a","b","c"]')
	    expect(convertTyped(typed)).toEqual(input)
	  })

	  it('processes integers correctly', () => {
	    const input = 42
	    const typed = toTyped(input)

	    expect(typed).toBe('N42')
	    expect(convertTyped(typed)).toBe(input)
	  })

	  it('processes floats correctly', () => {
	    const input = 0.543
	    const typed = toTyped(input)

	    expect(typed).toBe('N0.543')
	    expect(convertTyped(typed)).toBe(input)
	  })

	  it('processes null values correctly', () => {
	    const input = null
	    const typed = toTyped(input)

	    expect(typed).toBe('L')
	    expect(convertTyped(typed)).toBe(input)
	  })

	  it('processes Boolean true correctly', () => {
	    const input = true
	    const typed = toTyped(input)

	    expect(typed).toBe('T')
	    expect(convertTyped(typed)).toBe(input)
	  })

	  it('processes Boolean false correctly', () => {
	    const input = false
	    const typed = toTyped(input)

	    expect(typed).toBe('F')
	    expect(convertTyped(typed)).toBe(input)
	  })

	  it('processes undefined correctly', () => {
	    const typed = toTyped()

	    expect(typed).toBe('U')
	    expect(convertTyped(typed)).toBe(undefined)
	  })
	})
})
