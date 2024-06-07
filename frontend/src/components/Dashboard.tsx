import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getStockList, updateStockList, getProfile } from '../services/api';
import axios from 'axios';
import Papa from 'papaparse';
import './Dashboard.css';

interface SymbolEntry {
    symbol: string;
    status: 'Pending' | 'Downloading' | 'Downloaded';
    selected?: boolean;
}

const Dashboard: React.FC = () => {
    const { auth } = useContext(AuthContext);
    const [fromDate, setFromDate] = useState(() => localStorage.getItem('fromDate') || '');
    const [toDate, setToDate] = useState(() => localStorage.getItem('toDate') || '');
    const [timeframe, setTimeframe] = useState(() => localStorage.getItem('timeframe') || '1 min');
    const [symbol, setSymbol] = useState('');
    const [symbols, setSymbols] = useState<SymbolEntry[]>([]);
    const [dateError, setDateError] = useState('');
    const [downloadError, setDownloadError] = useState('');
    const [polygonApiKey, setPolygonApiKey] = useState('');

    useEffect(() => {
        const fetchStockList = async () => {
            try {
                const stockListString = await getStockList();
                const stockSymbols = stockListString.split(',').map((symbol: string) => ({
                    symbol,
                    status: 'Pending' as 'Pending',
                    selected: false,
                }));
                setSymbols(stockSymbols);
            } catch (error) {
                setDownloadError('Failed to fetch stock list.');
            }
        };

        const fetchProfile = async () => {
            try {
                const response = await getProfile(auth.token!);
                setPolygonApiKey(response.data.polygonApiKey);
            } catch (error) {
                setDownloadError('Failed to fetch profile.');
            }
        };

        fetchStockList();
        fetchProfile();
    }, []);

    useEffect(() => {
        localStorage.setItem('fromDate', fromDate);
    }, [fromDate]);

    useEffect(() => {
        localStorage.setItem('toDate', toDate);
    }, [toDate]);

    useEffect(() => {
        localStorage.setItem('timeframe', timeframe);
    }, [timeframe]);

    const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFromDate = e.target.value;
        if (new Date(newFromDate) <= new Date(toDate) || !toDate) {
            setFromDate(newFromDate);
            setDateError('');
        } else {
            setDateError('The "From" date must be before the "To" date.');
        }
    };

    const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newToDate = e.target.value;
        if (new Date(fromDate) <= new Date(newToDate) || !fromDate) {
            setToDate(newToDate);
            setDateError('');
        } else {
            setDateError('The "To" date must be after the "From" date.');
        }
    };

    const handleTimeframeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTimeframe(e.target.value);
    };

    const handleSymbolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const uppercaseSymbol = e.target.value.toUpperCase();
        if (uppercaseSymbol.length <= 6) {
            setSymbol(uppercaseSymbol);
        }
    };

    const handleAddSymbol = async () => {
        if (symbol.length === 0) {
            setDateError("You didn't add a symbol.");
            return;
        }

        if (symbol.length <= 6) {
            const updatedSymbols: SymbolEntry[] = [...symbols, { symbol, status: 'Pending', selected: false }];
            setSymbols(updatedSymbols);
            setSymbol('');
            setDateError('');

            await updateStockList(updatedSymbols.map(entry => entry.symbol).join(',')); // Updated line
        } else {
            setDateError('Symbol must be up to 6 characters long.');
        }
    };

    const handleRemoveSymbol = async (symbolToRemove: string) => {
        const updatedSymbols = symbols.filter(entry => entry.symbol !== symbolToRemove);
        setSymbols(updatedSymbols);
        await updateStockList(updatedSymbols.map(entry => entry.symbol).join(',')); // Updated line
    };

    const handleSelectSymbol = (index: number) => {
        const updatedSymbols = [...symbols];
        updatedSymbols[index].selected = !updatedSymbols[index].selected;
        setSymbols(updatedSymbols);
    };

    const handleSelectAll = () => {
        const allSelected = symbols.every(entry => entry.selected);
        const updatedSymbols = symbols.map(entry => ({
            ...entry,
            selected: !allSelected,
        }));
        setSymbols(updatedSymbols);
    };

    const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            const text = e.target?.result as string;
            const importedSymbols = text.split(',').map((symbol) => symbol.trim().toUpperCase());

            const updatedSymbols: SymbolEntry[] = [
                ...symbols,
                ...importedSymbols.map((symbol) => ({ symbol, status: 'Pending' as 'Pending', selected: false }))
            ];
            setSymbols(updatedSymbols);

            await updateStockList(updatedSymbols.map(entry => entry.symbol).join(','));
        };
        reader.readAsText(file);
    };

    const timeframeMap: { [key: string]: { interval: string, timespan: string } } = {
        '1 min': { interval: '1', timespan: 'minute' },
        '2 min': { interval: '2', timespan: 'minute' },
        '5 min': { interval: '5', timespan: 'minute' },
        '10 min': { interval: '10', timespan: 'minute' },
        '15 min': { interval: '15', timespan: 'minute' },
        '30 min': { interval: '30', timespan: 'minute' },
        '1 hour': { interval: '1', timespan: 'hour' },
        '1 day': { interval: '1', timespan: 'day' }
    };

    const formatDate = (date: string) => {
        const [year, month, day] = date.split('-');
        return `${year}-${month}-${day}`;
    };

    const handleDownload = async () => {
        const selectedSymbols = symbols.filter(entry => entry.selected).map(entry => entry.symbol);
        for (const sym of selectedSymbols) {
            try {
                const { interval, timespan } = timeframeMap[timeframe];
                const url = `https://api.polygon.io/v2/aggs/ticker/${sym}/range/${interval}/${timespan}/${formatDate(fromDate)}/${formatDate(toDate)}?adjusted=true&sort=asc&limit=50000&apiKey=${polygonApiKey}`;
                const response = await axios.get(url);
                const csvData = response.data.results;

                const csv = Papa.unparse(csvData);

                const blob = new Blob([csv], { type: 'text/csv' });
                const downloadUrl = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = downloadUrl;
                a.download = `${sym}_stock_data.csv`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            } catch (error: any) {
                if (error.response && error.response.status === 429) {
                    setDownloadError('You have reached the 5 request per minute limit. Upgrade to remove this cap.');
                } else {
                    setDownloadError(`Failed to download data for ${sym}.`);
                }
            }
        }
    };

    const isDownloadEnabled = symbols.some(entry => entry.selected);

    return (
        <div className="dashboard-container">
            <h1>Dashboard</h1>
            <form className="dashboard-form">
                <div className="form-group">
                    <label htmlFor="fromDate">From Date:</label>
                    <input
                        type="date"
                        id="fromDate"
                        value={fromDate}
                        onChange={handleFromDateChange}
                        placeholder="mm-dd-yyyy"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="toDate">To Date:</label>
                    <input
                        type="date"
                        id="toDate"
                        value={toDate}
                        onChange={handleToDateChange}
                        placeholder="mm-dd-yyyy"
                    />
                </div>
                {dateError && <div className="error-message">{dateError}</div>}
                <div className="form-group">
                    <label htmlFor="timeframe">Timeframe:</label>
                    <select id="timeframe" value={timeframe} onChange={handleTimeframeChange}>
                        <option value="1 min">1 min</option>
                        <option value="2 min">2 min</option>
                        <option value="5 min">5 min</option>
                        <option value="10 min">10 min</option>
                        <option value="15 min">15 min</option>
                        <option value="30 min">30 min</option>
                        <option value="1 hour">1 hour</option>
                        <option value="1 day">1 day</option>
                    </select>
                </div>
                <hr />
                <div className="form-group symbol-group">
                    <label htmlFor="symbol">Symbol:</label>
                    <input
                        type="text"
                        id="symbol"
                        value={symbol}
                        onChange={handleSymbolChange}
                        placeholder="Enter Symbol"
                        maxLength={6}
                    />
                    <button type="button" onClick={handleAddSymbol}>Add</button>
                    <input
                        type="file"
                        id="importFile"
                        accept=".txt"
                        onChange={handleImport}
                        style={{ display: 'none' }}
                    />
                    <label htmlFor="importFile" className="import-button">
                        Import
                    </label>
                    <button
                        type="button"
                        onClick={handleDownload}
                        disabled={!isDownloadEnabled}
                        className={`download-button ${isDownloadEnabled ? 'enabled' : 'disabled'}`}
                    >
                        Download
                    </button>
                </div>
                {downloadError && <div className="error-message">{downloadError}</div>}
                <button type="button" className="select-all-button" onClick={handleSelectAll}>Select All</button>
                <table className="symbol-table">
                    <thead>
                        <tr>
                            <th>Select</th>
                            <th>Symbol</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {symbols.map((entry, index) => (
                            <tr key={index}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={entry.selected || false}
                                        onChange={() => handleSelectSymbol(index)}
                                    />
                                </td>
                                <td>{entry.symbol}</td>
                                <td>{entry.status}</td>
                                <td>
                                    <button type="button" onClick={() => handleRemoveSymbol(entry.symbol)}>Remove</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </form>
        </div>
    );
};

export default Dashboard;
