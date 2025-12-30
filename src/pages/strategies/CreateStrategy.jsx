import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Cpu, X, Plus, Trash2, Sliders, Activity } from 'lucide-react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import SearchableSelect from '../../components/ui/SearchableSelect';
import useToast from '../../hooks/useToast';
import { createStrategy } from '../../api/strategies.api';
import { getSegments, getSymbols } from '../../api/market.api';

// Validation Schema
const schema = yup.object({
    name: yup.string().required('Strategy Name is required'),
    segment: yup.string().required('Segment is required'),
    symbol: yup.string().required('Symbol is required').uppercase(),
    action: yup.string().oneOf(['BUY', 'SELL']).required('Action is required'),
    timeframe: yup.string().required('Timeframe is required'),
    logic: yup.object({
        rules: yup.array().of(
            yup.object({
                indicator: yup.string().required('Indicator is required'),
                operator: yup.string().required('Operator is required'),
                value: yup.number().typeError('Must be a number').required('Value is required'),
            })
        ).min(1, 'At least one rule is required')
    })
}).required();

const CreateStrategy = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [segments, setSegments] = useState([]);
    const [symbols, setSymbols] = useState([]);

    const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            segment: '',
            action: 'BUY',
            timeframe: '5m',
            logic: {
                rules: [{ indicator: 'RSI', operator: '>', value: 50 }]
            }
        }
    });

    const selectedSegment = watch('segment');

    // 1. Fetch Segments on Mount
    useEffect(() => {
        const loadSegments = async () => {
            try {
                const data = await getSegments();
                setSegments(data);
                if (data.length > 0) {
                    setValue('segment', data[0].code); // Default to first segment
                }
            } catch (error) {
                console.error("Failed to load segments", error);
                toast.error("Failed to load market segments");
            }
        };
        loadSegments();
    }, [setValue]);

    // 2. Fetch Symbols when Segment Changes
    useEffect(() => {
        const loadSymbols = async () => {
            if (!selectedSegment) return;
            try {
                const data = await getSymbols(selectedSegment);
                setSymbols(data);
                setValue('symbol', ''); // Reset symbol when segment changes
            } catch (error) {
                console.error("Failed to load symbols", error);
                toast.error("Failed to load symbols");
            }
        };
        loadSymbols();
    }, [selectedSegment, setValue]);

    const { fields, append, remove } = useFieldArray({
        control,
        name: "logic.rules"
    });

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            // Construct payload matching backend Strategy model
            const payload = {
                ...data,
                type: 'CUSTOM_LOGIC',
                status: 'Paused' // Default status
            };

            await createStrategy(payload);
            toast.success('Strategy created successfully');
            navigate('/strategies/all');
        } catch (e) {
            console.error(e);
            toast.error('Failed to create strategy');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Cpu className="text-primary" /> Create New Strategy
                    </h1>
                    <p className="text-muted-foreground text-sm">Define automated trading rules</p>
                </div>
                <Button variant="outline" onClick={() => navigate('/strategies/all')} className="gap-2">
                    <X size={16} /> Cancel
                </Button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                {/* 1. Basic Configuration */}
                <Card className="p-6 space-y-6 overflow-visible">
                    <h2 className="text-lg font-semibold flex items-center gap-2 border-b border-border pb-2">
                        <Sliders size={18} className="text-primary" /> Basic Configuration
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Strategy Name"
                            placeholder="e.g. Nifty Momentum Bot"
                            {...register('name')}
                            error={errors.name?.message}
                        />
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-foreground block">Segment</label>
                            <select
                                {...register('segment')}
                                className="w-full h-10 px-3 rounded-md bg-secondary/50 border border-input text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                            >
                                {segments.map(seg => (
                                    <option key={seg._id} value={seg.code}>{seg.name}</option>
                                ))}
                            </select>
                            {errors.segment && <p className="text-xs text-red-500">{errors.segment.message}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-foreground block">Target Symbol</label>
                            <Controller
                                name="symbol"
                                control={control}
                                render={({ field }) => (
                                    <SearchableSelect
                                        options={symbols.map(s => ({ label: s.symbol, value: s.symbol }))}
                                        value={field.value}
                                        onChange={field.onChange}
                                        placeholder="Select Instrument..."
                                        searchPlaceholder="Search NIFTY, RELIANCE..."
                                        variant="standard"
                                        disabled={!selectedSegment}
                                    />
                                )}
                            />
                            {errors.symbol && <p className="text-xs text-red-500">{errors.symbol.message}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-foreground block">Action To Take</label>
                            <div className="grid grid-cols-2 gap-3 h-10">
                                <label className="cursor-pointer border rounded-md flex items-center justify-center gap-2 transition-all bg-emerald-500/10 border-emerald-500 text-emerald-500 font-bold has-[:checked]:ring-2 has-[:checked]:ring-emerald-500">
                                    <input type="radio" value="BUY" {...register('action')} className="hidden" />
                                    BUY
                                </label>
                                <label className="cursor-pointer border rounded-md flex items-center justify-center gap-2 transition-all bg-red-500/10 border-red-500 text-red-500 font-bold has-[:checked]:ring-2 has-[:checked]:ring-red-500">
                                    <input type="radio" value="SELL" {...register('action')} className="hidden" />
                                    SELL
                                </label>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-foreground block">Timeframe</label>
                            <select
                                {...register('timeframe')}
                                className="w-full h-10 px-3 rounded-md bg-secondary/50 border border-input text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                            >
                                <option value="1m">1 Minute</option>
                                <option value="5m">5 Minute</option>
                                <option value="15m">15 Minute</option>
                                <option value="1h">1 Hour</option>
                            </select>
                        </div>
                    </div>
                </Card>

                {/* 2. Logic Builder */}
                <Card className="p-6 space-y-6">
                    <h2 className="text-lg font-semibold flex items-center gap-2 border-b border-border pb-2">
                        <Activity size={18} className="text-primary" /> Logic Builder
                    </h2>

                    <div className="space-y-4">
                        {fields.map((field, index) => (
                            <div key={field.id} className="grid grid-cols-12 gap-4 items-end bg-secondary/10 p-4 rounded-lg border border-border/50">
                                <div className="col-span-5 space-y-1.5">
                                    <label className="text-xs font-medium text-muted-foreground block">Indicator</label>
                                    <select
                                        {...register(`logic.rules.${index}.indicator`)}
                                        className="w-full h-10 px-3 rounded-md bg-secondary/50 border border-input text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                                    >
                                        <option value="RSI">Relative Strength Index (RSI)</option>
                                        <option value="SMA">Simple Moving Average (SMA)</option>
                                        <option value="Price">Current Price</option>
                                    </select>
                                </div>
                                <div className="col-span-3 space-y-1.5">
                                    <label className="text-xs font-medium text-muted-foreground block">Condition</label>
                                    <select
                                        {...register(`logic.rules.${index}.operator`)}
                                        className="w-full h-10 px-3 rounded-md bg-secondary/50 border border-input text-sm focus:outline-none font-mono"
                                    >
                                        <option value=">">Greater Than (&gt;)</option>
                                        <option value="<">Less Than (&lt;)</option>
                                        <option value=">=">Greater or Equal (&ge;)</option>
                                        <option value="<=">Less or Equal (&le;)</option>
                                    </select>
                                </div>
                                <div className="col-span-3 space-y-1.5">
                                    <Input
                                        label="Value"
                                        type="number"
                                        placeholder="e.g. 50"
                                        {...register(`logic.rules.${index}.value`)}
                                        className="h-10"
                                    />
                                </div>
                                <div className="col-span-1 flex justify-center pb-1">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="h-10 w-10 p-0 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                        onClick={() => remove(index)}
                                        disabled={fields.length === 1}
                                    >
                                        <Trash2 size={18} />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => append({ indicator: 'RSI', operator: '>', value: 50 })}
                        className="w-full border border-dashed border-border text-muted-foreground hover:text-primary hover:border-primary/50"
                    >
                        <Plus size={16} className="mr-2" /> Add Condition
                    </Button>
                </Card>

                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => navigate('/strategies/all')}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="min-w-[150px]">
                        {isSubmitting ? 'Creating Bot...' : 'Create Strategy'}
                    </Button>
                </div>

            </form>
        </div>
    );
};

export default CreateStrategy;
