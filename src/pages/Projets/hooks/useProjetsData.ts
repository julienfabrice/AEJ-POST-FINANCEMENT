import { useEffect } from 'react'
import { useProjetsStore } from '@/store/useProjetsStore'
import { projetsServices } from '@/services/projets.services'

export function useProjetsData() {
  const { pagination: storePagination, setPagination, projets, setProjets, filters } = useProjetsStore()
  const { page, perPage } = storePagination

  const { data: response, isLoading, isError, isFetching } = projetsServices.useGetAll(page, perPage, filters)

  const pagination = response?.pagination
  const total = pagination?.total || 0

  useEffect(() => {
    if (response?.data) {
      setProjets(response.data)
    }
  }, [response?.data, setProjets])

  const nextPage = () => {
    if (pagination && page < pagination.last_page) {
      setPagination({ page: page + 1 })
    }
  }

  const prevPage = () => {
    if (page > 1) {
      setPagination({ page: page - 1 })
    }
  }

  return {
    projets,
    pagination,
    total,
    page,
    perPage,
    setPage: (p: number) => setPagination({ page: p }),
    setPerPage: (p: number) => setPagination({ perPage: p }),
    nextPage,
    prevPage,
    isLoading,
    isError,
    isFetching,
  }
}
