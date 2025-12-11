import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const EditSymbol = () => {
    const navigate = useNavigate();
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Edit Symbol</h2>
            <Card className="bg-[#050505] border-white/5 p-6 space-y-4">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-muted-foreground">Symbol Name</label>
                    <input type="text" defaultValue="NIFTY 50" className="w-full bg-secondary/30 border border-white/10 rounded p-2 text-sm" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-muted-foreground">Exchange Token</label>
                    <input type="text" defaultValue="26000" className="w-full bg-secondary/30 border border-white/10 rounded p-2 text-sm" />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => navigate('/market/manage')}>Cancel</Button>
                    <Button variant="primary">Update Symbol</Button>
                </div>
            </Card>
        </div>
    )
}

export default EditSymbol;
