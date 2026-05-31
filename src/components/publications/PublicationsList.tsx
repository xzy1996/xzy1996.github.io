'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
    MagnifyingGlassIcon,
    FunnelIcon,
    CalendarIcon,
    BookOpenIcon,
    ClipboardDocumentIcon,
    DocumentTextIcon,
    TagIcon
} from '@heroicons/react/24/outline';
import { Publication } from '@/types/publication';
import { PublicationPageConfig } from '@/types/page';
import { cn } from '@/lib/utils';
import { useMessages } from '@/lib/i18n/useMessages';
import FormattedBibTeXText from './FormattedBibTeXText';

interface PublicationsListProps {
    config: PublicationPageConfig;
    publications: Publication[];
    embedded?: boolean;
}

function normalizeTag(tag: string) {
    return tag.trim().toLowerCase();
}

function isTypeLikeTag(tag: string) {
    const normalized = normalizeTag(tag);
    return normalized === 'journal' || normalized === 'conference';
}

function tagDisplayClass(tag: string) {
    const normalized = normalizeTag(tag);

    if (
        normalized.includes('ccf-a') ||
        normalized.includes('中科院-q1') ||
        normalized.includes('cas q1')
    ) {
        return 'border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300';
    }

    if (
        normalized.includes('ccf-b') ||
        normalized.includes('中科院-q2') ||
        normalized.includes('cas q2')
    ) {
        return 'border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900/60 dark:bg-orange-950/30 dark:text-orange-300';
    }

    if (
        normalized.includes('ccf-c') ||
        normalized.includes('中科院-q3') ||
        normalized.includes('cas q3')
    ) {
        return 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300';
    }

    if (
        normalized.includes('中科院-q4') ||
        normalized.includes('cas q4')
    ) {
        return 'border-neutral-200 bg-neutral-50 text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300';
    }

    if (normalized === 'top') {
        return 'border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-900/60 dark:bg-yellow-950/30 dark:text-yellow-300';
    }

    if (
        normalized.includes('esi') ||
        normalized.includes('highly cited') ||
        normalized.includes('高被引')
    ) {
        return 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-300';
    }

    if (normalized.includes('arxiv')) {
        return 'border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900/60 dark:bg-purple-950/30 dark:text-purple-300';
    }

    if (normalized === 'sci' || normalized === 'ei') {
        return 'border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-900/60 dark:bg-teal-950/30 dark:text-teal-300';
    }

    return 'border-neutral-200 bg-neutral-50 text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300';
}

export default function PublicationsList({ config, publications, embedded = false }: PublicationsListProps) {
    const messages = useMessages();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedYears, setSelectedYears] = useState<number[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [showFilters, setShowFilters] = useState(false);
    const [expandedBibtexId, setExpandedBibtexId] = useState<string | null>(null);
    const [expandedAbstractId, setExpandedAbstractId] = useState<string | null>(null);

    const isChinese = messages.publications.searchPlaceholder.includes('搜索');

    const toggleYear = (year: number) => {
        setSelectedYears((prev) =>
            prev.includes(year)
                ? prev.filter((item) => item !== year)
                : [...prev, year]
        );
    };

    const toggleType = (type: string) => {
        setSelectedTypes((prev) =>
            prev.includes(type)
                ? prev.filter((item) => item !== type)
                : [...prev, type]
        );
    };

    const toggleTag = (tag: string) => {
        setSelectedTags((prev) =>
            prev.includes(tag)
                ? prev.filter((item) => item !== tag)
                : [...prev, tag]
        );
    };

    // Extract unique years for filters
    const years = useMemo(() => {
        const uniqueYears = Array.from(new Set(publications.map(p => p.year)));
        return uniqueYears.sort((a, b) => b - a);
    }, [publications]);

    // Extract unique types for filters
    const types = useMemo(() => {
        const uniqueTypes = Array.from(new Set(publications.map(p => p.type)));
        return uniqueTypes.sort();
    }, [publications]);

    // Extract unique tags from BibTeX keywords.
    // Type-like tags such as Journal/Conference are excluded here,
    // because they are already displayed in the Type filter.
    const allTags = useMemo(() => {
        const preferredOrder = [
            'SCI',
            'EI',
            '中科院-Q1',
            '中科院-Q2',
            '中科院-Q3',
            '中科院-Q4',
            'TOP',
        ];

        const typeNames = new Set(types.map((type) => normalizeTag(type)));

        const existingTags = new Set(
            publications
                .flatMap((p) => p.tags || [])
                .map((tag) => tag.trim())
                .filter(Boolean)
                .filter((tag) => !isTypeLikeTag(tag))
                .filter((tag) => !typeNames.has(normalizeTag(tag)))
        );

        const orderedTags = preferredOrder.filter((tag) => existingTags.has(tag));

        const remainingTags = Array.from(existingTags)
            .filter((tag) => !preferredOrder.includes(tag))
            .sort((a, b) => a.localeCompare(b));

        return [...orderedTags, ...remainingTags];
    }, [publications, types]);

    // Filter publications.
    // Within the same group, multiple selected values use OR logic.
    // Across different groups, filters use AND logic.
    const filteredPublications = useMemo(() => {
        return publications.filter(pub => {
            const query = searchQuery.toLowerCase();

            const matchesSearch =
                pub.title.toLowerCase().includes(query) ||
                pub.authors.some(author => author.name.toLowerCase().includes(query)) ||
                pub.journal?.toLowerCase().includes(query) ||
                pub.conference?.toLowerCase().includes(query);

            const matchesYear =
                selectedYears.length === 0 || selectedYears.includes(pub.year);

            const matchesType =
                selectedTypes.length === 0 || selectedTypes.includes(pub.type);

            const pubTags = pub.tags || [];
            const matchesTag =
                selectedTags.length === 0 ||
                selectedTags.some((tag) => pubTags.includes(tag));

            return matchesSearch && matchesYear && matchesType && matchesTag;
        });
    }, [publications, searchQuery, selectedYears, selectedTypes, selectedTags]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
        >
            <div className="mb-8">
                <h1 className={`${embedded ? "text-2xl" : "text-4xl"} font-serif font-bold text-primary mb-4`}>
                    {config.title}
                </h1>

                {config.description && (
                    <p className={`${embedded ? "text-base" : "text-lg"} text-neutral-600 dark:text-neutral-500 max-w-2xl`}>
                        {config.description}
                    </p>
                )}
            </div>

            {/* Search and Filter Controls */}
            <div className="mb-8 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-grow">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />

                        <input
                            type="text"
                            placeholder={messages.publications.searchPlaceholder}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
                        />
                    </div>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={cn(
                            "flex items-center justify-center px-4 py-2 rounded-lg border transition-all duration-200",
                            showFilters
                                ? "bg-accent text-white border-accent"
                                : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-600 hover:border-accent hover:text-accent"
                        )}
                    >
                        <FunnelIcon className="h-5 w-5 mr-2" />
                        {messages.publications.filters}
                    </button>
                </div>

                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-800 flex flex-wrap gap-8">
                                {/* Year Filter */}
                                <div className="space-y-2">
                                    <div className="text-sm font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
                                        <CalendarIcon className="h-4 w-4" />
                                        <span>{messages.publications.year}</span>

                                        {selectedYears.length > 0 && (
                                            <button
                                                onClick={() => setSelectedYears([])}
                                                className="text-xs font-medium text-accent hover:underline"
                                            >
                                                Clear
                                            </button>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {years.map(year => (
                                            <button
                                                key={year}
                                                onClick={() => toggleYear(year)}
                                                className={cn(
                                                    "px-3 py-1 text-xs rounded-full transition-colors",
                                                    selectedYears.includes(year)
                                                        ? "bg-accent text-white"
                                                        : "bg-white dark:bg-neutral-800 text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                                                )}
                                            >
                                                {year}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Type Filter */}
                                <div className="space-y-2">
                                    <div className="text-sm font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
                                        <BookOpenIcon className="h-4 w-4" />
                                        <span>{messages.publications.type}</span>

                                        {selectedTypes.length > 0 && (
                                            <button
                                                onClick={() => setSelectedTypes([])}
                                                className="text-xs font-medium text-accent hover:underline"
                                            >
                                                Clear
                                            </button>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {types.map(type => (
                                            <button
                                                key={type}
                                                onClick={() => toggleType(type)}
                                                className={cn(
                                                    "px-3 py-1 text-xs rounded-full capitalize transition-colors",
                                                    selectedTypes.includes(type)
                                                        ? "bg-accent text-white"
                                                        : "bg-white dark:bg-neutral-800 text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                                                )}
                                            >
                                                {type.replace('-', ' ')}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Tag Filter */}
                                {allTags.length > 0 && (
                                    <div className="space-y-2">
                                        <div className="text-sm font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
                                            <TagIcon className="h-4 w-4" />
                                            <span>Tags</span>

                                            {selectedTags.length > 0 && (
                                                <button
                                                    onClick={() => setSelectedTags([])}
                                                    className="text-xs font-medium text-accent hover:underline"
                                                >
                                                    Clear
                                                </button>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {allTags.map(tag => (
                                                <button
                                                    key={tag}
                                                    onClick={() => toggleTag(tag)}
                                                    className={cn(
                                                        "px-3 py-1 text-xs rounded-full transition-colors",
                                                        selectedTags.includes(tag)
                                                            ? "bg-accent text-white"
                                                            : "bg-white dark:bg-neutral-800 text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                                                    )}
                                                >
                                                    {tag}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <p className="mb-6 text-sm text-neutral-600 dark:text-neutral-400">
                {isChinese ? '共找到' : 'Found'}{' '}
                <span className="font-semibold text-accent">
                    {filteredPublications.length}
                </span>{' '}
                {isChinese ? '篇论文。' : 'publication(s).'}
            </p>

            {/* Publications Grid */}
            <div className="space-y-6">
                {filteredPublications.length === 0 ? (
                    <div className="text-center py-12 text-neutral-500">
                        {messages.publications.noResults}
                    </div>
                ) : (
                    filteredPublications.map((pub, index) => {
                        const displayTags = (pub.tags || [])
                            .map((tag) => tag.trim())
                            .filter(Boolean)
                            .filter((tag) => !isTypeLikeTag(tag));

                        return (
                            <motion.div
                                key={pub.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.1 * index }}
                                className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 hover:shadow-md transition-all duration-200"
                            >
                                <div className="flex flex-col md:flex-row gap-6">
                                    {pub.preview && (
                                        <div className="w-full md:w-48 flex-shrink-0">
                                            <div className="aspect-video md:aspect-[4/3] relative rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                                                <Image
                                                    src={`/papers/${pub.preview}`}
                                                    alt={pub.title}
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex-grow">
                                        <h3 className={`${embedded ? "text-lg" : "text-xl"} font-semibold text-primary mb-2 leading-tight`}>
                                            <FormattedBibTeXText nodes={pub.titleNodes} fallback={pub.title} />
                                        </h3>

                                        <p className={`${embedded ? "text-sm" : "text-base"} text-neutral-600 dark:text-neutral-400 mb-2`}>
                                            {pub.authors.map((author, idx) => (
                                                <span key={idx}>
                                                    <span className={`${author.isHighlighted ? 'font-semibold text-accent' : ''} ${author.isCoAuthor ? `underline underline-offset-4 ${author.isHighlighted ? 'decoration-accent' : 'decoration-neutral-400'}` : ''}`}>
                                                        {author.name}
                                                    </span>

                                                    {author.isCorresponding && (
                                                        <sup className={`ml-0 ${author.isHighlighted ? 'text-accent' : 'text-neutral-600 dark:text-neutral-400'}`}>†</sup>
                                                    )}

                                                    {idx < pub.authors.length - 1 && ', '}
                                                </span>
                                            ))}
                                        </p>

                                        <p className="text-sm font-medium text-neutral-800 dark:text-neutral-600 mb-3">
                                            {pub.journal || pub.conference} {pub.year}
                                        </p>

                                        {pub.description && (
                                            <p className="text-sm text-neutral-600 dark:text-neutral-500 mb-4 line-clamp-3">
                                                {pub.description}
                                            </p>
                                        )}

                                        <div className="flex flex-col gap-3 mt-auto sm:flex-row sm:items-center sm:justify-between">
                                            <div className="flex flex-wrap gap-2">
                                                {pub.doi && (
                                                    <a
                                                        href={`https://doi.org/${pub.doi}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-accent hover:text-white transition-colors"
                                                    >
                                                        DOI
                                                    </a>
                                                )}

                                                {pub.code && (
                                                    <a
                                                        href={pub.code}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-accent hover:text-white transition-colors"
                                                    >
                                                        {messages.publications.code}
                                                    </a>
                                                )}

                                                {pub.abstract && (
                                                    <button
                                                        onClick={() => setExpandedAbstractId(expandedAbstractId === pub.id ? null : pub.id)}
                                                        className={cn(
                                                            "inline-flex items-center px-3 py-1 rounded-md text-xs font-medium transition-colors",
                                                            expandedAbstractId === pub.id
                                                                ? "bg-accent text-white"
                                                                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-accent hover:text-white"
                                                        )}
                                                    >
                                                        <DocumentTextIcon className="h-3 w-3 mr-1.5" />
                                                        {messages.publications.abstract}
                                                    </button>
                                                )}

                                                {pub.bibtex && (
                                                    <button
                                                        onClick={() => setExpandedBibtexId(expandedBibtexId === pub.id ? null : pub.id)}
                                                        className={cn(
                                                            "inline-flex items-center px-3 py-1 rounded-md text-xs font-medium transition-colors",
                                                            expandedBibtexId === pub.id
                                                                ? "bg-accent text-white"
                                                                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-accent hover:text-white"
                                                        )}
                                                    >
                                                        <BookOpenIcon className="h-3 w-3 mr-1.5" />
                                                        {messages.publications.bibtex}
                                                    </button>
                                                )}
                                            </div>

                                            {displayTags.length > 0 && (
                                                <div className="flex flex-wrap gap-2 sm:justify-end">
                                                    {displayTags.map((tag) => (
                                                        <span
                                                            key={tag}
                                                            className={cn(
                                                                "inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold",
                                                                tagDisplayClass(tag)
                                                            )}
                                                        >
                                                            <TagIcon className="mr-1 h-3.5 w-3.5" />
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <AnimatePresence>
                                            {expandedAbstractId === pub.id && pub.abstract ? (
                                                <motion.div
                                                    key="abstract"
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="overflow-hidden mt-4"
                                                >
                                                    <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700">
                                                        <p className="text-sm text-neutral-600 dark:text-neutral-500 leading-relaxed">
                                                            {pub.abstract}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            ) : null}

                                            {expandedBibtexId === pub.id && pub.bibtex ? (
                                                <motion.div
                                                    key="bibtex"
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="overflow-hidden mt-4"
                                                >
                                                    <div className="relative bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700">
                                                        <pre className="text-xs text-neutral-600 dark:text-neutral-500 overflow-x-auto whitespace-pre-wrap font-mono">
                                                            {pub.bibtex}
                                                        </pre>

                                                        <button
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(pub.bibtex || '');
                                                            }}
                                                            className="absolute top-2 right-2 p-1.5 rounded-md bg-white dark:bg-neutral-700 text-neutral-500 hover:text-accent shadow-sm border border-neutral-200 dark:border-neutral-600 transition-colors"
                                                            title={messages.common.copyToClipboard}
                                                        >
                                                            <ClipboardDocumentIcon className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            ) : null}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>
        </motion.div>
    );
}