'use client';

import { useState } from 'react';

import type { LucideIcon } from 'lucide-react';
import {
  AlertCircle,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Bell,
  Bookmark,
  Calendar,
  Camera,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Download,
  Edit,
  Eye,
  Filter,
  Heart,
  Home,
  Image,
  Info,
  Link,
  Mail,
  Map,
  Menu,
  MessageCircle,
  Phone,
  Plus,
  Search,
  Settings,
  Share,
  ShoppingCart,
  Star,
  Trash,
  Upload,
  User,
  X,
} from 'lucide-react';

import { cn } from '@repo/ui/utils';

import Select from './select';

export const DEFAULT_ICONS: Record<string, LucideIcon> = {
  AlertCircle,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Bell,
  Bookmark,
  Calendar,
  Camera,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Download,
  Edit,
  Eye,
  Filter,
  Heart,
  Home,
  Image,
  Info,
  Link,
  Mail,
  Map,
  Menu,
  MessageCircle,
  Phone,
  Plus,
  Search,
  Settings,
  Share,
  ShoppingCart,
  Star,
  Trash,
  Upload,
  User,
  X,
};

interface Props {
  icons?: Record<string, LucideIcon>;
  defaultValue?: string;
  value?: string;
  placeholder?: string;
  className?: string;
  onChange?: (name: string) => void;
}

const IconPicker = ({
  icons = DEFAULT_ICONS,
  defaultValue,
  value: _value,
  placeholder,
  className,
  onChange: _onChange = () => {},
}: Props) => {
  const [uncontrolledValue, setUncontrolledValue] = useState<
    string | undefined
  >(defaultValue);

  const controlled = _value !== undefined;
  const value = controlled ? _value : uncontrolledValue;

  const onChange = (name: string) => {
    if (!controlled) {
      setUncontrolledValue(name);
    }
    _onChange(name);
  };

  const options = Object.entries(icons).map(([name, Icon]) => ({
    label: (
      <span className="flex items-center gap-2">
        <Icon size={14} />
        {name}
      </span>
    ),
    value: name,
  }));

  const SelectedIcon = value ? icons[value] : undefined;

  return (
    <div
      className={cn(
        'flex items-center gap-2',
        className,
        //
      )}
    >
      <Select
        value={value}
        placeholder={placeholder}
        options={options}
        onChange={onChange}
      />
      {SelectedIcon && <SelectedIcon size={18} className="shrink-0" />}
    </div>
  );
};

export default IconPicker;
export type { Props };
