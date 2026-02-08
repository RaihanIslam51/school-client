import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API_BASE_URL } from '../../config/api';

// Generic API fetch function with caching
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Students Hooks
export const useStudents = (filters = {}) => {
  return useQuery({
    queryKey: ['students', filters],
    queryFn: () => apiRequest('/students', {
      method: 'GET',
      body: null,
    }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  });
};

export const useStudent = (id) => {
  return useQuery({
    queryKey: ['student', id],
    queryFn: () => apiRequest(`/students/${id}`),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCreateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (studentData) => apiRequest('/students', {
      method: 'POST',
      body: JSON.stringify(studentData),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => apiRequest(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['student', variables.id] });
    },
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => apiRequest(`/students/${id}`, {
      method: 'DELETE',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
};

// Teachers Hooks
export const useTeachers = () => {
  return useQuery({
    queryKey: ['teachers'],
    queryFn: () => apiRequest('/teachers'),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

export const useTeacher = (id) => {
  return useQuery({
    queryKey: ['teacher', id],
    queryFn: () => apiRequest(`/teachers/${id}`),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
};

export const useCreateTeacher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (teacherData) => apiRequest('/teachers', {
      method: 'POST',
      body: JSON.stringify(teacherData),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
    },
  });
};

export const useUpdateTeacher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => apiRequest(`/teachers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      queryClient.invalidateQueries({ queryKey: ['teacher', variables.id] });
    },
  });
};

export const useDeleteTeacher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => apiRequest(`/teachers/${id}`, {
      method: 'DELETE',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
    },
  });
};

// Salaries Hooks
export const useSalaries = (filters = {}) => {
  // Create a stable query key from filters
  const queryKey = ['salaries', filters];

  return useQuery({
    queryKey,
    queryFn: () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          params.append(key, value);
        }
      });
      params.append('limit', '1000'); // Increased limit to ensure all records are fetched
      params.append('page', '1'); // Ensure we're getting the first page
      params.append('sort', '-createdAt');

      return apiRequest(`/salaries?${params.toString()}`);
    },
    staleTime: 2 * 60 * 1000, // 2 minutes for salaries (more dynamic)
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
};

export const useSalary = (id) => {
  return useQuery({
    queryKey: ['salary', id],
    queryFn: () => apiRequest(`/salaries/${id}`),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useSalaryStatistics = (filters = {}) => {
  return useQuery({
    queryKey: ['salary-statistics', filters],
    queryFn: () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          params.append(key, value);
        }
      });
      return apiRequest(`/salaries/statistics?${params.toString()}`);
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateSalary = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (salaryData) => apiRequest('/salaries', {
      method: 'POST',
      body: JSON.stringify(salaryData),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salaries'] });
      queryClient.invalidateQueries({ queryKey: ['salary-statistics'] });
    },
  });
};

export const useUpdateSalary = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => apiRequest(`/salaries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['salaries'] });
      queryClient.invalidateQueries({ queryKey: ['salary', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['salary-statistics'] });
    },
  });
};

export const useDeleteSalary = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => apiRequest(`/salaries/${id}`, {
      method: 'DELETE',
    }),
    onMutate: async (id) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['salaries'] });

      // Snapshot the previous value
      const previousSalaries = queryClient.getQueryData(['salaries']);

      // Optimistically update to the new value
      queryClient.setQueryData(['salaries'], (old) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.filter(salary => salary._id !== id)
        };
      });

      return { previousSalaries };
    },
    onError: (err, id, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousSalaries) {
        queryClient.setQueryData(['salaries'], context.previousSalaries);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salaries'] });
      queryClient.invalidateQueries({ queryKey: ['salary-statistics'] });
    },
  });
};

// Notices Hooks
export const useNotices = () => {
  return useQuery({
    queryKey: ['notices'],
    queryFn: () => apiRequest('/notices'),
    staleTime: 1 * 60 * 1000, // 1 minute (notices change frequently)
    gcTime: 10 * 60 * 1000,
  });
};

export const useCreateNotice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (noticeData) => apiRequest('/notices', {
      method: 'POST',
      body: JSON.stringify(noticeData),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notices'] });
    },
  });
};

// Results/Exams Hooks
export const useResults = (filters = {}) => {
  return useQuery({
    queryKey: ['results', filters],
    queryFn: () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      return apiRequest(`/results?${params.toString()}`);
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

export const useCreateResult = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (resultData) => apiRequest('/results', {
      method: 'POST',
      body: JSON.stringify(resultData),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['results'] });
    },
  });
};

// Fees Hooks
export const useFees = (filters = {}) => {
  return useQuery({
    queryKey: ['fees', filters],
    queryFn: () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      return apiRequest(`/fees?${params.toString()}`);
    },
    staleTime: 3 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  });
};

export const useCreateFee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (feeData) => apiRequest('/fees', {
      method: 'POST',
      body: JSON.stringify(feeData),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fees'] });
    },
  });
};

// Expenses Hooks
export const useExpenses = (filters = {}) => {
  return useQuery({
    queryKey: ['expenses', filters],
    queryFn: () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      return apiRequest(`/expenses?${params.toString()}`);
    },
    staleTime: 3 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  });
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (expenseData) => apiRequest('/expenses', {
      method: 'POST',
      body: JSON.stringify(expenseData),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });
};

export const useApproveSalary = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => apiRequest(`/salaries/${id}/approve`, {
      method: 'PUT',
      body: JSON.stringify({ approvedBy: 'Admin' }),
    }),
    onMutate: async (id) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['salaries'] });

      // Snapshot the previous value
      const previousSalaries = queryClient.getQueryData(['salaries']);

      // Optimistically update to the new value
      queryClient.setQueryData(['salaries'], (old) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map(salary =>
            salary._id === id
              ? { ...salary, status: 'Approved', approvedDate: new Date(), approvedBy: 'Admin' }
              : salary
          )
        };
      });

      return { previousSalaries };
    },
    onError: (err, id, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousSalaries) {
        queryClient.setQueryData(['salaries'], context.previousSalaries);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salaries'] });
      queryClient.invalidateQueries({ queryKey: ['salary-statistics'] });
    },
  });
};

export const useRejectSalary = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }) => apiRequest(`/salaries/${id}/reject`, {
      method: 'PUT',
      body: JSON.stringify({ rejectionReason: reason, rejectedBy: 'Admin' }),
    }),
    onMutate: async ({ id, reason }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['salaries'] });

      // Snapshot the previous value
      const previousSalaries = queryClient.getQueryData(['salaries']);

      // Optimistically update to the new value
      queryClient.setQueryData(['salaries'], (old) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map(salary =>
            salary._id === id
              ? { ...salary, status: 'Rejected', rejectionReason: reason, rejectedBy: 'Admin' }
              : salary
          )
        };
      });

      return { previousSalaries };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousSalaries) {
        queryClient.setQueryData(['salaries'], context.previousSalaries);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salaries'] });
      queryClient.invalidateQueries({ queryKey: ['salary-statistics'] });
    },
  });
};

export const useMarkSalaryAsPaid = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => apiRequest(`/salaries/${id}/mark-paid`, {
      method: 'PUT',
      body: JSON.stringify({ paymentDate: new Date() }),
    }),
    onMutate: async (id) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['salaries'] });

      // Snapshot the previous value
      const previousSalaries = queryClient.getQueryData(['salaries']);

      // Optimistically update to the new value
      queryClient.setQueryData(['salaries'], (old) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map(salary =>
            salary._id === id
              ? { ...salary, status: 'Paid', paidDate: new Date(), paidBy: 'Admin' }
              : salary
          )
        };
      });

      return { previousSalaries };
    },
    onError: (err, id, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousSalaries) {
        queryClient.setQueryData(['salaries'], context.previousSalaries);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salaries'] });
      queryClient.invalidateQueries({ queryKey: ['salary-statistics'] });
    },
  });
};

export const useBulkApproveSalaries = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (salaryIds) => apiRequest('/salaries/bulk/approve', {
      method: 'POST',
      body: JSON.stringify({ salaryIds, approvedBy: 'Admin' }),
    }),
    onMutate: async (salaryIds) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['salaries'] });

      // Snapshot the previous value
      const previousSalaries = queryClient.getQueryData(['salaries']);

      // Optimistically update to the new value
      queryClient.setQueryData(['salaries'], (old) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map(salary =>
            salaryIds.includes(salary._id)
              ? { ...salary, status: 'Approved', approvedDate: new Date(), approvedBy: 'Admin' }
              : salary
          )
        };
      });

      return { previousSalaries };
    },
    onError: (err, salaryIds, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousSalaries) {
        queryClient.setQueryData(['salaries'], context.previousSalaries);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salaries'] });
      queryClient.invalidateQueries({ queryKey: ['salary-statistics'] });
    },
  });
};

export const useBulkDeleteSalaries = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (salaryIds) => apiRequest('/salaries/bulk/delete', {
      method: 'POST',
      body: JSON.stringify({ salaryIds }),
    }),
    onMutate: async (salaryIds) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['salaries'] });

      // Snapshot the previous value
      const previousSalaries = queryClient.getQueryData(['salaries']);

      // Optimistically update to the new value
      queryClient.setQueryData(['salaries'], (old) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.filter(salary => !salaryIds.includes(salary._id))
        };
      });

      return { previousSalaries };
    },
    onError: (err, salaryIds, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousSalaries) {
        queryClient.setQueryData(['salaries'], context.previousSalaries);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salaries'] });
      queryClient.invalidateQueries({ queryKey: ['salary-statistics'] });
    },
  });
};

// Prefetch functions for better UX
export const prefetchSalaries = async (queryClient) => {
  await queryClient.prefetchQuery({
    queryKey: ['salaries'],
    queryFn: () => apiRequest('/salaries'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const prefetchStudents = async (queryClient) => {
  await queryClient.prefetchQuery({
    queryKey: ['students'],
    queryFn: () => apiRequest('/students'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const prefetchTeachers = async (queryClient) => {
  await queryClient.prefetchQuery({
    queryKey: ['teachers'],
    queryFn: () => apiRequest('/teachers'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};