import type { ProfileSectionId } from '@upiq/shared'
import {
  Award,
  Briefcase,
  Clock,
  DollarSign,
  FileText,
  FolderGit2,
  Languages,
  MessageSquareQuote,
  Sparkles,
  Star,
  Tag,
  type LucideIcon,
} from 'lucide-react'

/** A single editable field inside a repeatable list item. */
export interface ItemFieldDef {
  key: string
  label: string
  type: 'text' | 'textarea' | 'url' | 'select'
  placeholder?: string
  options?: string[]
  required?: boolean
  maxLength?: number
}

export type SectionKind = 'text' | 'textarea' | 'tags' | 'list' | 'rate' | 'select'

export interface SectionConfig {
  id: ProfileSectionId
  label: string
  description: string
  icon: LucideIcon
  kind: SectionKind
  required: boolean
  /** Char limit for text/textarea kinds. */
  maxLength?: number
  minLength?: number
  placeholder?: string
  /** Options for the 'select' kind. */
  options?: string[]
  /** Field defs for the 'list' kind. */
  itemFields?: ItemFieldDef[]
  /** Singular noun for list items, e.g. "role", "project". */
  itemNoun?: string
  /** A contextual tip shown in the AI assistant when this section is active. */
  tip: string
}

export const SECTION_CONFIGS: SectionConfig[] = [
  {
    id: 'title',
    label: 'Profile Title',
    description: 'Your headline — the first thing clients read.',
    icon: Sparkles,
    kind: 'text',
    required: true,
    maxLength: 70,
    minLength: 10,
    placeholder: 'Senior Full-Stack Engineer | React, Node, AWS',
    tip: 'Lead with your specialty and the outcomes you deliver — not just job titles.',
  },
  {
    id: 'overview',
    label: 'Professional Overview',
    description: 'A compelling summary of who you are and the value you bring.',
    icon: FileText,
    kind: 'textarea',
    required: true,
    maxLength: 5000,
    minLength: 200,
    placeholder:
      'Open with the problem you solve and for whom. Back it with measurable achievements…',
    tip: 'Adding measurable achievements (e.g. “cut load time by 40%”) improves profile quality.',
  },
  {
    id: 'skills',
    label: 'Skills',
    description: 'The keywords clients search for. Add 10–15 relevant skills.',
    icon: Tag,
    kind: 'tags',
    required: true,
    tip: 'Match your skills to the exact terms used in the jobs you want to win.',
  },
  {
    id: 'employment',
    label: 'Employment History',
    description: 'Roles that demonstrate relevant, credible experience.',
    icon: Briefcase,
    kind: 'list',
    required: false,
    itemNoun: 'role',
    itemFields: [
      { key: 'role', label: 'Role', type: 'text', required: true, placeholder: 'Senior Engineer' },
      { key: 'company', label: 'Company', type: 'text', required: true, placeholder: 'Acme Inc.' },
      { key: 'period', label: 'Period', type: 'text', placeholder: '2021 – Present' },
      {
        key: 'description',
        label: 'Description',
        type: 'textarea',
        maxLength: 1000,
        placeholder: 'What you owned and the impact you made…',
      },
    ],
    tip: 'Quantify impact in each role. Numbers make experience believable.',
  },
  {
    id: 'portfolio',
    label: 'Portfolio Projects',
    description: 'Showcase work that proves you can deliver.',
    icon: FolderGit2,
    kind: 'list',
    required: false,
    itemNoun: 'project',
    itemFields: [
      {
        key: 'title',
        label: 'Title',
        type: 'text',
        required: true,
        placeholder: 'E-commerce redesign',
      },
      {
        key: 'url',
        label: 'Project URL',
        type: 'url',
        placeholder: 'https://example.com/case-study',
      },
      {
        key: 'description',
        label: 'Description',
        type: 'textarea',
        maxLength: 800,
        placeholder: 'The brief, your approach, and the measurable result…',
      },
    ],
    tip: 'One strong, well-documented portfolio piece beats five thin ones.',
  },
  {
    id: 'projectCatalog',
    label: 'Project Catalog',
    description: 'Productized services clients can buy directly.',
    icon: Star,
    kind: 'list',
    required: false,
    itemNoun: 'catalog item',
    itemFields: [
      {
        key: 'title',
        label: 'Title',
        type: 'text',
        required: true,
        placeholder: 'Landing page in 5 days',
      },
      { key: 'price', label: 'Starting Price', type: 'text', placeholder: '$500' },
      {
        key: 'description',
        label: 'Description',
        type: 'textarea',
        maxLength: 600,
        placeholder: 'What’s included and who it’s for…',
      },
    ],
    tip: 'Catalog projects help clients buy without a back-and-forth — great for conversion.',
  },
  {
    id: 'reviews',
    label: 'Client Reviews',
    description: 'Social proof from previous clients.',
    icon: MessageSquareQuote,
    kind: 'list',
    required: false,
    itemNoun: 'review',
    itemFields: [
      { key: 'client', label: 'Client', type: 'text', placeholder: 'Jane D., Product Lead' },
      {
        key: 'rating',
        label: 'Rating',
        type: 'select',
        options: ['5.0', '4.5', '4.0', '3.5', '3.0'],
      },
      {
        key: 'feedback',
        label: 'Feedback',
        type: 'textarea',
        required: true,
        maxLength: 800,
        placeholder: 'Paste the client’s feedback…',
      },
    ],
    tip: 'Specific praise (“delivered ahead of schedule”) is more persuasive than generic stars.',
  },
  {
    id: 'languages',
    label: 'Languages',
    description: 'Languages you can work in, with proficiency.',
    icon: Languages,
    kind: 'list',
    required: false,
    itemNoun: 'language',
    itemFields: [
      { key: 'language', label: 'Language', type: 'text', required: true, placeholder: 'English' },
      {
        key: 'proficiency',
        label: 'Proficiency',
        type: 'select',
        options: ['Native or Bilingual', 'Fluent', 'Conversational', 'Basic'],
      },
    ],
    tip: 'Listing languages can unlock region-specific work and higher trust.',
  },
  {
    id: 'certifications',
    label: 'Certifications',
    description: 'Credentials that reinforce your expertise.',
    icon: Award,
    kind: 'list',
    required: false,
    itemNoun: 'certification',
    itemFields: [
      {
        key: 'name',
        label: 'Name',
        type: 'text',
        required: true,
        placeholder: 'AWS Solutions Architect',
      },
      { key: 'issuer', label: 'Issuer', type: 'text', placeholder: 'Amazon Web Services' },
      { key: 'year', label: 'Year', type: 'text', placeholder: '2024' },
    ],
    tip: 'Relevant certifications can tip a hiring decision in close races.',
  },
  {
    id: 'hourlyRate',
    label: 'Hourly Rate',
    description: 'Your headline rate (USD/hour).',
    icon: DollarSign,
    kind: 'rate',
    required: true,
    placeholder: '65',
    tip: 'Price for the value you deliver. Underpricing can signal inexperience.',
  },
  {
    id: 'availability',
    label: 'Availability',
    description: 'How much you can take on right now.',
    icon: Clock,
    kind: 'select',
    required: false,
    options: [
      'More than 30 hrs/week',
      'Less than 30 hrs/week',
      'As needed - open to offers',
      'Not available',
    ],
    tip: 'Clear availability helps clients self-select before reaching out.',
  },
]

export const SECTION_MAP: Record<ProfileSectionId, SectionConfig> = SECTION_CONFIGS.reduce(
  (acc, cfg) => {
    acc[cfg.id] = cfg
    return acc
  },
  {} as Record<ProfileSectionId, SectionConfig>
)

export const SECTION_ORDER: ProfileSectionId[] = SECTION_CONFIGS.map((c) => c.id)
