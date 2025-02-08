import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { Skeleton } from '../src/components/ui/skeleton';

describe('Skeleton', () => {
  it('renders the Skeleton component with default classes', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass('animate-pulse rounded-md bg-primary/10');
  });

  it('renders the Skeleton component with additional class names', () => {
    const { container } = render(<Skeleton className="extra-class" />);
    expect(container.firstChild).toHaveClass('animate-pulse rounded-md bg-primary/10 extra-class');
  });

  it('renders the Skeleton component with additional props', () => {
    const { container } = render(<Skeleton data-testid="skeleton" />);
    expect(container.firstChild).toHaveAttribute('data-testid', 'skeleton');
  });
});