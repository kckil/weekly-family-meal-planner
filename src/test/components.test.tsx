import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../components/ui/Button';
import { Tag } from '../components/ui/Tag';
import { TypeDot } from '../components/ui/TypeDot';
import { TextInput } from '../components/ui/TextInput';
import { Segmented } from '../components/ui/Segmented';
import { Modal } from '../components/ui/Modal';
import { Toast } from '../components/ui/Toast';
import { SectionHeading } from '../components/ui/SectionHeading';

describe('Button', () => {
  it('renders children text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const fn = vi.fn();
    render(<Button onClick={fn}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', () => {
    const fn = vi.fn();
    render(<Button onClick={fn} disabled>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(fn).not.toHaveBeenCalled();
  });

  it('renders with different variants without crashing', () => {
    const { container } = render(
      <>
        <Button variant="primary">P</Button>
        <Button variant="outline">O</Button>
        <Button variant="ghost">G</Button>
        <Button variant="subtle">S</Button>
        <Button variant="accent">A</Button>
      </>
    );
    expect(container.querySelectorAll('button')).toHaveLength(5);
  });

  // Regression: button labels must not contain special characters that break JSX
  it('renders labels with special characters safely', () => {
    render(<Button>Surprise Me!</Button>);
    expect(screen.getByText('Surprise Me!')).toBeInTheDocument();
  });
});

describe('Tag', () => {
  it('renders children', () => {
    render(<Tag>dinner</Tag>);
    expect(screen.getByText('dinner')).toBeInTheDocument();
  });

  it('renders with different tones', () => {
    const { container } = render(
      <>
        <Tag tone="sage">s</Tag>
        <Tag tone="butter">b</Tag>
        <Tag tone="terra">t</Tag>
        <Tag tone="neutral">n</Tag>
      </>
    );
    expect(container.querySelectorAll('span')).toHaveLength(4);
  });
});

describe('TypeDot', () => {
  it('renders without crashing for breakfast', () => {
    const { container } = render(<TypeDot type="breakfast" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders without crashing for dinner', () => {
    const { container } = render(<TypeDot type="dinner" />);
    expect(container.firstChild).toBeInTheDocument();
  });
});

describe('TextInput', () => {
  it('renders with placeholder', () => {
    render(<TextInput value="" onChange={() => {}} placeholder="Search…" />);
    expect(screen.getByPlaceholderText('Search…')).toBeInTheDocument();
  });

  it('calls onChange on input', () => {
    const fn = vi.fn();
    render(<TextInput value="" onChange={fn} placeholder="Type" />);
    fireEvent.change(screen.getByPlaceholderText('Type'), { target: { value: 'hello' } });
    expect(fn).toHaveBeenCalledWith('hello');
  });
});

describe('Segmented', () => {
  it('renders all options', () => {
    render(
      <Segmented value="a" onChange={() => {}} options={[
        { value: 'a', label: 'Alpha' },
        { value: 'b', label: 'Beta' },
      ]} />
    );
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
  });

  it('calls onChange when option clicked', () => {
    const fn = vi.fn();
    render(
      <Segmented value="a" onChange={fn} options={[
        { value: 'a', label: 'Alpha' },
        { value: 'b', label: 'Beta' },
      ]} />
    );
    fireEvent.click(screen.getByText('Beta'));
    expect(fn).toHaveBeenCalledWith('b');
  });
});

describe('Modal', () => {
  it('renders nothing when not open', () => {
    const { container } = render(<Modal open={false} onClose={() => {}} title="Test">Content</Modal>);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders content when open', () => {
    render(<Modal open={true} onClose={() => {}} title="My Modal">Hello</Modal>);
    expect(screen.getByText('My Modal')).toBeInTheDocument();
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('calls onClose when backdrop clicked', () => {
    const fn = vi.fn();
    render(<Modal open={true} onClose={fn} title="Test">Content</Modal>);
    // The backdrop is 2 levels up: Content → scroll div → modal panel → backdrop
    fireEvent.click(screen.getByText('Content').parentElement!.parentElement!);
    expect(fn).toHaveBeenCalled();
  });
});

describe('Toast', () => {
  it('renders nothing for null', () => {
    const { container } = render(<Toast toast={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders message when provided', () => {
    render(<Toast toast="Copied!" />);
    expect(screen.getByText('Copied!')).toBeInTheDocument();
  });
});

describe('SectionHeading', () => {
  it('renders title and eyebrow', () => {
    render(<SectionHeading title="Main Title" eyebrow="Sub" />);
    expect(screen.getByText('Main Title')).toBeInTheDocument();
    expect(screen.getByText('Sub')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(<SectionHeading title="T">Description text</SectionHeading>);
    expect(screen.getByText('Description text')).toBeInTheDocument();
  });
});
