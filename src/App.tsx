import React, { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'

function App() {
  const VIEWS = {
    pageView: 'Page View',
    event: 'Event',
    referrer: 'Referrer',
  }

  const [view, setView] = useState(VIEWS.pageView)
  const [page, setPage] = useState('')
  const [startDate, setStartDate] = useState<string>(
    new Date().toISOString().substring(0, 10)
  )
  const [endDate, setEndDate] = useState<string>('today')

  const [pageView, setPageView] = useState([])
  const [events, setEvents] = useState()
  const [referrers, setReferrers] = useState()

  const getPageView = () => {
    axios.get('http://localhost:3000/api/analytics/pageview', {
      params: {
        shopName: page,
        start: startDate,
        end: endDate,
      },
    })
    .then((res) => {
      const _pageViewRows: any = []
      res.data.rows.forEach((row: any) => {
        _pageViewRows.push(row.dimensionValues[0].value + " : " + row.metricValues[0].value);
      });
      setPageView(_pageViewRows)
    })
    .catch((err) => console.log(err))
  }

  const getEvents = () => {
    axios.get('http://localhost:3000/api/analytics/events', {
      params: {
        shopName: page,
        start: startDate,
        end: endDate,
      },
    })
    .then((res) => {
      const _eventRows: any = []
      res.data.rows.forEach((row: any) => {
        _eventRows.push(row.dimensionValues[0].value + " : " + row.metricValues[0].value);
      });
      setEvents(_eventRows)
    })
    .catch((err) => console.log(err))
  }

  const getReferrers = () => {
    axios.get('http://localhost:3000/api/analytics/referrers', {
      params: {
        shopName: page,
        start: startDate,
        end: endDate,
      },
    })
    .then((res) => {
      const _referrersRows: any = []
      res.data.rows.forEach((row: any) => {
        _referrersRows.push(row.dimensionValues[1].value + " : " + row.metricValues[0].value);
      });
      setReferrers(_referrersRows)
    })
    .catch((err) => console.log(err))
  }

  const fetchData = () => {
    getPageView()
    getEvents()
    getReferrers()
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className='App'>
      <form action="">
        <div style={{ display: 'flex', flexDirection: 'column', margin: '0 auto', width: '400px'}}>
          <p>Page</p>
          <input type="text" onChange={(e) => setPage(e.target.value)} />
          <p>Start date (YYYY-MM-DD)</p>
          <input type="text" onChange={(e) => setStartDate(e.target.value)} />
          <p>End date (YYYY-MM-DD)</p>
          <input type="text" onChange={(e) => setEndDate(e.target.value)} />
        </div>
        <div style={{ height: '20px' }}></div>
        <button type='submit' onClick={(e) => {
          e.preventDefault()
          fetchData()
        }}>Search</button>
      </form>
      <div style={{ height: '20px' }}></div>
      <button onClick={() => setView(VIEWS.pageView)}>Page View</button>
      <button onClick={() => setView(VIEWS.event)}>Events</button>
      <button onClick={() => setView(VIEWS.referrer)}>Referrers</button>
      <h1>{view}</h1>
      {view === VIEWS.pageView && (
        <div>
          <p>{JSON.stringify(pageView)}</p>
        </div>
      )}
      {view === VIEWS.event && (
        <div>
          <p>{JSON.stringify(events)}</p>
        </div>
      )}
      {view === VIEWS.referrer && (
        <div>
          <p>{JSON.stringify(referrers)}</p>
        </div>
      )}
    </div>
  )
}

export default App
