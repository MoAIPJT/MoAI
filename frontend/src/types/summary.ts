// 요약본 섹션 타입
export interface SummarySection {
  title: string
  content: string
}

// 요약본 데이터 타입
export interface SummaryData {
  id: string
  title: string
  sections: SummarySection[]
  originalPdfPath?: string
}

// 더미 요약본 데이터
export const dummySummaryData: Record<string, SummaryData> = {
  'cats-dogs': {
    id: 'cats-dogs',
    title: 'Summary of "Cats and Dogs" Research',
    sections: [
      {
        title: 'Objective',
        content: 'Fine-grained categorization of pet breeds (37 breeds of cats and dogs).'
      },
      {
        title: 'Dataset',
        content: 'Oxford-IIIT Pet dataset with 7,349 annotated images.'
      },
      {
        title: 'Model',
        content: 'Combines shape (deformable part model) and appearance (bag-of-words) for classification.'
      },
      {
        title: 'Results',
        content: 'Achieved 59% average accuracy on breed discrimination; surpassed previous ASIRRA test results.'
      }
    ],
    originalPdfPath: '/src/assets/pdfs/cats-and-dogs.pdf'
  },
  'i-love-duck': {
    id: 'i-love-duck',
    title: 'Summary of "I Love Duck" Research',
    sections: [
      {
        title: 'Objective',
        content: 'Duck behavior analysis and classification in natural environments.'
      },
      {
        title: 'Dataset',
        content: 'Wild duck dataset with 5,000+ images across different seasons.'
      },
      {
        title: 'Model',
        content: 'Deep learning model using CNN architecture for duck species identification.'
      },
      {
        title: 'Results',
        content: 'Achieved 78% accuracy in duck species classification with real-time processing capability.'
      }
    ],
    originalPdfPath: '/src/assets/pdfs/i-love-duck.pdf'
  },
  'hamburger': {
    id: 'hamburger',
    title: 'Summary of "햄버거 맛있겠다" Research',
    sections: [
      {
        title: 'Objective',
        content: 'Analysis of hamburger preferences and taste classification.'
      },
      {
        title: 'Dataset',
        content: 'Hamburger review dataset with 10,000+ user reviews and ratings.'
      },
      {
        title: 'Model',
        content: 'Sentiment analysis model using BERT for taste prediction.'
      },
      {
        title: 'Results',
        content: 'Achieved 85% accuracy in predicting user satisfaction based on review text.'
      }
    ],
    originalPdfPath: '/src/assets/pdfs/hamburger.pdf'
  },
  'omori-kalguksu': {
    id: 'omori-kalguksu',
    title: 'Summary of "오모리생바지락칼국수" Research',
    sections: [
      {
        title: 'Objective',
        content: 'Analysis of traditional Korean noodle dish preferences and quality assessment.'
      },
      {
        title: 'Dataset',
        content: 'Restaurant review dataset with 8,500+ reviews of kalguksu restaurants.'
      },
      {
        title: 'Model',
        content: 'Multi-modal model combining text analysis and image recognition.'
      },
      {
        title: 'Results',
        content: 'Achieved 92% accuracy in predicting restaurant quality and customer satisfaction.'
      }
    ],
    originalPdfPath: '/src/assets/pdfs/omori-kalguksu.pdf'
  }
} 