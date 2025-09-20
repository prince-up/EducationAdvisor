import React from 'react'
import { render, screen } from '@testing-library/react'
import LoadingSpinner from '../LoadingSpinner'

describe('LoadingSpinner', () => {
  it('renders with default text', () => {
    render(<LoadingSpinner />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders with custom text', () => {
    render(<LoadingSpinner text="Custom loading text" />)
    expect(screen.getByText('Custom loading text')).toBeInTheDocument()
  })

  it('renders with custom size', () => {
    render(<LoadingSpinner size="sm" />)
    // The spinner should be present
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('renders with custom className', () => {
    render(<LoadingSpinner className="custom-class" />)
    const container = screen.getByText('Loading...').closest('div')
    expect(container).toHaveClass('custom-class')
  })
})
