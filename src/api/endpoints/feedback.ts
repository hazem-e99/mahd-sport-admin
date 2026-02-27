export const FEEDBACK_API = {
  getFeedbackRatings: "FeedbacksApi/GetFeedbackRatings",
  getFeedbacks: "FeedbacksApi/GetFeedbacks",
  getFeedbackDetails: (id: number) => `FeedbacksApi?id=${id}`,
  deleteFeedback: (id: number) => `FeedbacksApi/${id}`,
  exportFeedbacks: "FeedbacksApi/ExportFeedbacks",
};

export const DEPARTMENT_API = {
  getDictionary: '/Department/GetDictionary',
} as const;