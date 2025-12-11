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
    type: yup.string().oneOf(['BUY', 'SELL']).required('Type is required'),
    entry: yup.number().required('Entry price is required'),
    stoploss: yup.number().required('Stoploss is required'),
    target: yup.number().required('Target is required'),
}).required();

const CreateSignal = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = (data) => {
        console.log(data);
        setTimeout(() => {
            navigate('/signals');
        }, 500);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-white">Post New Signal</h2>
            <Card className="p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <Input
                            label="Symbol / Scrip"
                            placeholder="e.g. BANKNIFTY"
                            {...register('symbol')}
                            error={errors.symbol?.message}
                        />
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-slate-400">Signal Type</label>
                            <select
                                {...register('type')}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="BUY">BUY</option>
                                <option value="SELL">SELL</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                        <Input label="Entry Price" type="number" step="0.01" {...register('entry')} error={errors.entry?.message} />
                        <Input label="Stop Loss" type="number" step="0.01" {...register('stoploss')} error={errors.stoploss?.message} />
                        <Input label="Target" type="number" step="0.01" {...register('target')} error={errors.target?.message} />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => navigate('/signals')}>Cancel</Button>
                        <Button type="submit" variant="primary">Publish Signal</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default CreateSignal;
