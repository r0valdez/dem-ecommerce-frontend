import { useState, useEffect } from 'react'
import Table from './components/Table/Table'
import './App.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export interface Product {
  _id: string,
  title: string,
  price: number,
  size: string,
  color: string,
  quantity: number,
  [key: string]: string | number
}

function App() {
  const [products, setProducts] = useState<Array<Product>>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [countPerPage, setCountPerPage] = useState<number>(5)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [search, setSearch] = useState<string>('')
  const [sort, setSort] = useState<string>('')
  const [selectedRow, setSelectedRow] = useState<object>()
  const columns = [{
    key: '_id',
    width: '5%',
  }, {
    key: 'title',
    width: '35%',
  }, {
    key: 'price',
    width: '5%',
  }, {
    key: 'size',
    width: '5%',
  }, {
    key: 'color',
    width: '5%',
  }, {
    key: 'quantity',
    width: '5%',
  }, {
    key: 'actions',
    width: '20%',
  }]
  
  const fetchData = () => {
    setLoading(true)
    const queryParams = new URLSearchParams({ page: '' + currentPage, limit: '' + countPerPage, search, sort })
    console.log('Fetch Query Params ... ', queryParams.toString())
    
    fetch(`${API_BASE_URL}/products?${queryParams.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setTableData(data)
        setLoading(false)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const setTableData = (data: any) => {
    const sanitizedProducts = data.docs.map((item: any) => {
      const { updatedAt, createdAt, ...rest } = item
      
      return {
        _id: rest._id,
        ...rest,
        action: true
      }
    })
    setProducts(sanitizedProducts)
    setTotalPages(data.totalPages)
  }

  const onPrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
      setQueryParam('page', '' + currentPage)
    }
  }

  const onNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
      setQueryParam('page', '' + currentPage)
    }
  }

  const handleSelectPageCount = (value: string) => {
    setCountPerPage(+value)
    setQueryParam('limit', value)
  }

  const handleFilter = (value : string) => {
    setSearch(value)
    setQueryParam('search', value)
  }

  const handleSubmit = () => {
    fetchData()
  }

  const handleSort = (value: string) => {
    if (value === '_id') {
      setSort('')
      setQueryParam('sort', '')
    }
    setSort(value)
    setQueryParam('sort', value)
  }

  const setQueryParam = (name: string, value: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set(name, value);
    window.history.pushState({}, '', url.toString());
  }

  const handleSelectRow = (data: Product) => {
    setSelectedRow(data)
  }

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search)
    
    const page = queryParams.get('page')
    const limit = queryParams.get('limit')
    const search = queryParams.get('search')
    const sort = queryParams.get('sort')

    if (page) setCurrentPage(+page)
    if (limit) setCountPerPage(+limit)
    if (sort) setSort(sort)
    if (search) { 
      setSearch(search)
      fetchData()
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [currentPage, countPerPage, sort])

  return (
    <>
      <h1>Demo Collection</h1>
      <Table
        columns={columns}
        data={products}
        selectable={true}
        pagination={true}
        filter={true}
        filterValue={search}
        onFilterChange={handleFilter}
        currentPage={currentPage}
        countPerPage={countPerPage}
        onPrev={onPrev}
        onNext={onNext}
        onSelectPageCount={handleSelectPageCount}
        onSubmit={handleSubmit}
        onSort={handleSort}
        onSelectRow={handleSelectRow}
        loading={loading}
      />
      {selectedRow && <pre>{JSON.stringify(selectedRow)}</pre>}
    </>
  )
}

export default App
