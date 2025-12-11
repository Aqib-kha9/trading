import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const schema = yup.object({
    symbol: yup.string().required('Symbol is required'),
    exchange: yup.string().required('Exchange is required'),
    lotSize: yup.number().positive().integer().required('Lot Size is required'),
}).required();

const AddSymbol = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = (data) => {
        console.log(data);
        setTimeout(() => {
            navigate('/market');
        }, 500);
    };

    return (
        <div className="max-w-xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-white">Add Market Symbol</h2>
            <Card className="p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <Input
                        label="Symbol Name"
                        placeholder="e.g. TATASTEEL"
                        {...register('symbol')}
                        error={errors.symbol?.message}
                    />

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-slate-400">Exchange</label>
                            <select
                                {...register('exchange')}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Exchange</option>
                                <option value="NSE">NSE</option>
                                <option value="MCX">MCX</option>
                                <option value="BSE">BSE</option>
                                <option value="CRYPTO">CRYPTO</option>
                                <option value="FOREX">FOREX</option>
                            </select>
                            {errors.exchange && <p className="text-xs text-red-500">{errors.exchange.message}</p>}
                        </div>

                        <Input
                            label="Lot Size"
                            type="number"
                            placeholder="1"
                            {...register('lotSize')}
                            error={errors.lotSize?.message}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => navigate('/market')}>Cancel</Button>
                        <Button type="submit" variant="primary">Add Symbol</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default AddSymbol;
