import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ApiKeyGuard } from 'src/common/guards/api-key.guard';

@Controller('market')
export class MarketController {
    constructor() { }

    @Get('/price/binance')
    @UseGuards(ApiKeyGuard)
    async getPriceBinance(@Query() queryParams: any) {
        const response = await fetch("https://api.binance.com/api/v3/ticker/price");
        const data = await response.json();
        const query = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'XRPUSDT', 'ADAUSDT', 'SOLUSDT', 'DOGEUSDT', 'DOTUSDT', 'POLUSDT', 'LTCUSDT'];
        const filteredData = data.filter((item: any) => {
            return item.symbol.endsWith('USDT') && Number(item.price) && query.includes(item.symbol);
        })
            .sort((a: any, b: any) => Number(b.price) - Number(a.price))
        // .reduce((acc: any, item: any) => {
        //     acc[item.symbol] = item.price;
        //     return acc;
        // }, {});

        return filteredData;
    }

    @Get('/price/bybit')
    @UseGuards(ApiKeyGuard)
    async getPriceBybit() {
        const response = await fetch("https://api.bybit.com/v5/market/tickers?category=spot");
        const data = await response.json();
        const query = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'XRPUSDT', 'ADAUSDT', 'SOLUSDT', 'DOGEUSDT', 'DOTUSDT', 'POLUSDT', 'LTCUSDT'];
        const filteredData = data.result.list.filter((item: any) => {
            return item.symbol.endsWith('USDT') && Number(item.usdIndexPrice) && query.includes(item.symbol);
        })
            .sort((a: any, b: any) => Number(b.usdIndexPrice) - Number(a.usdIndexPrice))
            .map((item: any) => ({
                symbol: item.symbol,
                price: Number(item.usdIndexPrice)
            }));

        return filteredData;
    }

    @Get('/price/kucoin')
    @UseGuards(ApiKeyGuard)
    async getPriceKucoin() {
        const response = await fetch("https://api.kucoin.com/api/v1/market/allTickers");
        const data = await response.json();
        const query = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'XRPUSDT', 'ADAUSDT', 'SOLUSDT', 'DOGEUSDT', 'DOTUSDT', 'POLUSDT', 'LTCUSDT'];
        const filteredData = data.data.ticker.filter((item: any) => {
            const symbol = item.symbol.replace('-', '');
            return item.symbol.endsWith('USDT') && Number(item.last) && query.includes(symbol);
        })
            .sort((a: any, b: any) => Number(b.last) - Number(a.last))
            .map((item: any) => ({
                symbol: item.symbol.replace('-', ''),
                price: Number(item.last)
            }));

        return filteredData;
    }
    @Get('/price/huobi')
    @UseGuards(ApiKeyGuard)
    async getPriceHuobi() {
        const response = await fetch("https://api.huobi.pro/market/tickers");
        const data = await response.json();
        const query = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'XRPUSDT', 'ADAUSDT', 'SOLUSDT', 'DOGEUSDT', 'DOTUSDT', 'POLUSDT', 'LTCUSDT'];
        const filteredData = data.data.filter((item: any) => {
            return item.symbol.toUpperCase().endsWith('USDT') && Number(item.close) && query.includes(item.symbol.toUpperCase());
        })
            .sort((a: any, b: any) => Number(b.close) - Number(a.close))
            .map((item: any) => ({
                symbol: item.symbol.toUpperCase(),
                price: Number(item.close)
            }));

        return filteredData;
    }

    @Get('/price/okx')
    @UseGuards(ApiKeyGuard)
    async getPriceOkx() {
        const response = await fetch("https://www.okx.com/api/v5/market/tickers?instType=SPOT");
        const data = await response.json();
        const query = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'XRPUSDT', 'ADAUSDT', 'SOLUSDT', 'DOGEUSDT', 'DOTUSDT', 'POLUSDT', 'LTCUSDT'];
        const filteredData = data.data.filter((item: any) => {
            const symbol = item.instId.replace('-', '');
            return item.instId.endsWith('USDT') && Number(item.last) && query.includes(symbol);
        })
            .sort((a: any, b: any) => Number(b.last) - Number(a.last))
            .map((item: any) => ({
                symbol: item.instId.replace('-', ''),
                price: Number(item.last)
            }));

        return filteredData;
    }
}
