import assert from 'node:assert/strict';
import test from 'node:test';
import {
  ABOUT_BASE_SECTIONS,
  ABOUT_FALLBACK,
  ABOUT_SECTIONS,
  DEFAULT_TOP_PROJECTS,
  TOP_PROJECTS_SECTION_META,
  getAboutSections,
  resolveAboutContent,
} from '../components/pages/About/aboutContent';
import type { PublishedAbout, PublishedTopProject } from '../lib/cms/publishedContent';

test('DEFAULT_TOP_PROJECTS supplies the 4 curated fallback projects', () => {
  assert.equal(DEFAULT_TOP_PROJECTS.length, 4);

  assert.deepEqual(DEFAULT_TOP_PROJECTS[0], {
    index: '01',
    name: 'Kemcon',
    description:
      'A full eco-system for Kemcon company that helps destibute leads through out the website and a full crm for managing the day to day actions also an a automated email to whatsapp integeration in the factory.',
    url: 'https://www.kemcon.site/',
  });

  assert.deepEqual(DEFAULT_TOP_PROJECTS[1], {
    index: '02',
    name: 'Dar El-Kola',
    description:
      'A full managment system for the patients, sessions, medications and invistigations for each indipendent appointment.',
    url: null,
  });

  assert.deepEqual(DEFAULT_TOP_PROJECTS[2], {
    index: '03',
    name: 'Einherji',
    description:
      "Clients to sell to, suppliers to buy from, roles to apply for — three hunts, one pipeline. Twenty-three sources feed a single queue, and every contact arrives with a message drafted in that hunt's own voice.",
    url: null,
  });

  assert.deepEqual(DEFAULT_TOP_PROJECTS[3], {
    index: '04',
    name: 'Valkyrie',
    description:
      'A shop floor with the stock room built in. Stock, pricing, coupons, reviews and the homepage itself are edited in the same console that carries an order from checkout to delivery — paid by card through Stripe, or cash at the door.',
    url: 'https://www.valkyrie-eg.com/',
  });

  // ABOUT_FALLBACK includes the default top projects
  assert.deepEqual(ABOUT_FALLBACK.topProjects, DEFAULT_TOP_PROJECTS);
});

test('ABOUT_SECTIONS registry includes section 06 with correct metadata', () => {
  assert.equal(ABOUT_SECTIONS.length, 6);
  assert.deepEqual(ABOUT_SECTIONS[5], {
    key: 'top-projects',
    label: 'Top projects',
    number: '06',
    title: 'Top performing projects',
  });
  assert.deepEqual(TOP_PROJECTS_SECTION_META, {
    key: 'top-projects',
    label: 'Top projects',
    number: '06',
    title: 'Top performing projects',
  });
});

test('getAboutSections dynamically includes or drops section 06 based on project presence', () => {
  // When top projects exist, section 06 is present for orbit rail and anchor navigation
  const withProjects = getAboutSections(true);
  assert.equal(withProjects.length, 6);
  assert.equal(withProjects[5].key, 'top-projects');
  assert.equal(withProjects[5].number, '06');

  // When top projects list is empty, section 06 and its station are dropped completely
  const withoutProjects = getAboutSections(false);
  assert.equal(withoutProjects.length, 5);
  assert.deepEqual(withoutProjects, ABOUT_BASE_SECTIONS);
  assert.ok(withoutProjects.every((s) => s.key !== 'top-projects'));
});

test('resolveAboutContent correctly resolves fallback when CMS is unconfigured or null', () => {
  const resolved = resolveAboutContent(null);
  assert.equal(resolved.topProjects.length, 4);
  assert.deepEqual(resolved.topProjects, DEFAULT_TOP_PROJECTS);
});

test('resolveAboutContent preserves empty topProjects as a valid designed state', () => {
  const published: PublishedAbout = {
    eyebrow: 'About',
    title: ['One technology partner.', 'Multiple systems.'],
    lead: 'Lead text',
    premiseParagraphs: ['Premise'],
    premiseQuote: 'Quote',
    principles: [],
    buildPhases: [],
    instruments: [],
    instrumentsNote: 'Note',
    stack: [],
    stackNote: 'Note',
    topProjects: [],
    closingTitle: 'Closing',
    closingLead: 'Lead',
    careersInvite: 'Invite',
  };

  const resolved = resolveAboutContent(published);
  assert.deepEqual(resolved.topProjects, []);
});

test('resolveAboutContent defaults undefined topProjects to empty array for older releases', () => {
  // Simulating an older CMS release payload that lacks the topProjects field
  const olderPublished = {
    eyebrow: 'About',
    title: ['One technology partner.', 'Multiple systems.'],
    lead: 'Lead text',
    premiseParagraphs: ['Premise'],
    premiseQuote: 'Quote',
    principles: [],
    buildPhases: [],
    instruments: [],
    instrumentsNote: 'Note',
    stack: [],
    stackNote: 'Note',
    closingTitle: 'Closing',
    closingLead: 'Lead',
    careersInvite: 'Invite',
  } as unknown as PublishedAbout;

  const resolved = resolveAboutContent(olderPublished);
  assert.deepEqual(resolved.topProjects, []);
});

test('resolveAboutContent resolves custom published topProjects from CMS', () => {
  const customProject: PublishedTopProject = {
    index: '01',
    name: 'Custom Project',
    description: 'Custom Description',
    url: 'https://example.com/',
  };

  const published: PublishedAbout = {
    eyebrow: 'About',
    title: ['One technology partner.', 'Multiple systems.'],
    lead: 'Lead text',
    premiseParagraphs: ['Premise'],
    premiseQuote: 'Quote',
    principles: [],
    buildPhases: [],
    instruments: [],
    instrumentsNote: 'Note',
    stack: [],
    stackNote: 'Note',
    topProjects: [customProject],
    closingTitle: 'Closing',
    closingLead: 'Lead',
    careersInvite: 'Invite',
  };

  const resolved = resolveAboutContent(published);
  assert.equal(resolved.topProjects.length, 1);
  assert.deepEqual(resolved.topProjects[0], customProject);
});

test('resolveAboutContent supports split titleLine1 and titleLine2', () => {
  const published: PublishedAbout = {
    eyebrow: 'About',
    titleLine1: 'Line 1.',
    titleLine2: 'Line 2.',
    lead: 'Lead text',
    premiseParagraphs: ['Premise'],
    premiseQuote: 'Quote',
    principles: [],
    buildPhases: [],
    instruments: [],
    instrumentsNote: 'Note',
    stack: [],
    stackNote: 'Note',
    topProjects: [],
    closingTitle: 'Closing',
    closingLead: 'Lead',
    careersInvite: 'Invite',
  };

  const resolved = resolveAboutContent(published);
  assert.deepEqual(resolved.title, ['Line 1.', 'Line 2.']);
});
