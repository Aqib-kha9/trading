import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const schema = yup.object({
    name: yup.string().required('Plan name is required'),
    price: yup.number().positive('Price must be positive').typeError('Price must be a number').required('Price is required'),
    validity_days: yup.number().integer().positive().typeError('Validity must be a number').required('Validity is required'),
    features: yup.string().required('Features are required (comma separated)'),
}).required();

const EditPlan = () => {
    const navigate = useNavigate();

    // Mock existing data
    const defaultValues = {
        name: 'Gold Membership',
        price: 4999,
        validity_days: 90,
        features: 'Intraday Signals, Nifty Options, BankNifty Options, Priority Support'
    };

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues
    });

    const onSubmit = (data) => {
        console.log('Updated:', data);
        setTimeout(() => {
            navigate('/plans/all');
        }, 500);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Edit Plan</h2>
            <Card className="bg-[#050505] border-white/5">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <Input
                        label="Plan Name"
                        placeholder="e.g. Premium Plan"
                        {...register('name')}
                        error={errors.name?.message}
                    />

                    <div className="grid grid-cols-2 gap-6">
                        <Input
                            label="Price (₹)"
                            type="number"
                            placeholder="0"
                            {...register('price')}
                            error={errors.price?.message}
                        />
                        <Input
                            label="Validity (Days)"
                            type="number"
                            placeholder="30"
                            {...register('validity_days')}
                            error={errors.validity_days?.message}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">Features (Comma separated)</label>
                        <textarea
                            {...register('features')}
                            className="w-full bg-secondary/30 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:border-primary/50 focus:outline-none transition-colors h-32 resize-none text-foreground placeholder:text-muted-foreground"
                            placeholder="Intraday Signals, Email Support, etc."
                        />
                        {errors.features && <p className="text-xs text-red-500">{errors.features.message}</p>}
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                        <Button type="button" variant="outline" onClick={() => navigate('/plans/all')}>Cancel</Button>
                        <Button type="submit" variant="primary">Update Plan</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default EditPlan;
