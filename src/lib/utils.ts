export function cn(...inputs: (string | undefined | null | boolean)[]) {
  return inputs.filter(Boolean).join(' ');
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateCollegeEmail(email: string, domain: string = 'kprit.edu.in'): boolean {
  return email.endsWith(`@${domain}`);
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: any;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function calculateRelevanceScore(contact: {
  position: string;
  company: string;
  source: string;
}): number {
  let score = 0;
  
  // Position relevance
  const hrKeywords = ['hr', 'human resources', 'talent', 'recruitment', 'recruiter', 'hiring'];
  const positionLower = contact.position.toLowerCase();
  hrKeywords.forEach(keyword => {
    if (positionLower.includes(keyword)) score += 2;
  });
  
  // Source reliability
  switch (contact.source) {
    case 'signalhire':
    case 'apollo':
      score += 3;
      break;
    case 'linkedin':
      score += 2;
      break;
    case 'manual':
      score += 1;
      break;
  }
  
  // Company type (could be enhanced with company database)
  if (contact.company.length > 0) score += 1;
  
  return Math.min(score, 10); // Cap at 10
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substr(0, 2);
}