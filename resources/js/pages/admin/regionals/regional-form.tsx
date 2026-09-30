import { useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Regional, RegionalCity } from '@/types/regional';

interface RegionalFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    regional: Regional | null;
}

interface CityFormData {
    id?: number;
    name: string;
    state: string;
    is_headquarters: boolean;
}

export function RegionalForm({ open, onOpenChange, regional }: RegionalFormProps) {
    const isEditing = Boolean(regional);

    const { data, setData, post, patch, processing, errors, reset, clearErrors } = useForm<{
        name: string;
        code: string;
        cities: CityFormData[];
    }>({
        name: regional?.name ?? '',
        code: regional?.code ?? '',
        cities: regional?.cities && regional.cities.length > 0
            ? regional.cities.map((c) => ({
                  id: c.id,
                  name: c.name,
                  state: c.state,
                  is_headquarters: c.is_headquarters,
              }))
            : [{ name: '', state: '', is_headquarters: true }],
    });

    useEffect(() => {
        if (open) {
            clearErrors();
            if (regional) {
                const initialCities = regional.cities && regional.cities.length > 0
                    ? regional.cities.map((c) => ({
                          id: c.id,
                          name: c.name,
                          state: c.state,
                          is_headquarters: c.is_headquarters,
                      }))
                    : [{ name: regional.city || '', state: regional.state || '', is_headquarters: true }];

                setData({
                    name: regional.name,
                    code: regional.code,
                    cities: initialCities,
                });
            } else {
                setData({
                    name: '',
                    code: '',
                    cities: [{ name: '', state: '', is_headquarters: true }],
                });
            }
        }
    }, [open, regional]);

    const handleAddCity = () => {
        const hasSede = data.cities.some((c) => c.is_headquarters);
        setData('cities', [
            ...data.cities,
            { name: '', state: data.cities[0]?.state || '', is_headquarters: !hasSede },
        ]);
    };

    const handleRemoveCity = (index: number) => {
        if (data.cities.length <= 1) return;
        const removingIsSede = data.cities[index].is_headquarters;
        const newCities = data.cities.filter((_, i) => i !== index);
        if (removingIsSede && newCities.length > 0) {
            newCities[0].is_headquarters = true;
        }
        setData('cities', newCities);
    };

    const handleCityChange = (index: number, field: keyof CityFormData, value: any) => {
        const newCities = [...data.cities];
        if (field === 'is_headquarters' && value === true) {
            newCities.forEach((c, i) => {
                c.is_headquarters = i === index;
            });
        } else {
            newCities[index] = {
                ...newCities[index],
                [field]: field === 'state' ? String(value).toUpperCase() : value,
            };
        }
        setData('cities', newCities);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing && regional) {
            patch(`/admin/regionals/${regional.id}`, {
                onSuccess: () => onOpenChange(false),
            });
        } else {
            post('/admin/regionals', {
                onSuccess: () => {
                    reset();
                    onOpenChange(false);
                },
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[560px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>
                            {isEditing ? 'Editar Regional' : 'Nova Regional'}
                        </DialogTitle>
                        <DialogDescription>
                            {isEditing
                                ? 'Atualize as informações cadastrais e cidades desta divisão regional.'
                                : 'Preencha os dados e adicione as cidades atendidas por esta regional.'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nome da Regional *</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Ex: Regional Sul, Facção Curitiba"
                                required
                            />
                            {errors.name && (
                                <p className="text-sm font-medium text-destructive">{errors.name}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="code">Código / Sigla *</Label>
                            <Input
                                id="code"
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                placeholder="Ex: SUL, PR-CWB"
                                required
                            />
                            {errors.code && (
                                <p className="text-sm font-medium text-destructive">{errors.code}</p>
                            )}
                        </div>

                        {/* Cidades da Regional */}
                        <div className="mt-2 space-y-3 rounded-lg border border-border/60 bg-muted/20 p-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label className="text-sm font-semibold">Cidades de Abrangência *</Label>
                                    <p className="text-xs text-muted-foreground">
                                        Defina as cidades atendidas e selecione exatamente uma como Sede.
                                    </p>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleAddCity}
                                    className="h-8 text-xs"
                                >
                                    + Adicionar Cidade
                                </Button>
                            </div>

                            {errors.cities && (
                                <p className="text-sm font-medium text-destructive">{errors.cities}</p>
                            )}

                            <div className="space-y-2">
                                {data.cities.map((city, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-2 rounded-md border bg-background p-2"
                                    >
                                        <div className="flex-1">
                                            <Input
                                                value={city.name}
                                                onChange={(e) =>
                                                    handleCityChange(idx, 'name', e.target.value)
                                                }
                                                placeholder="Nome da cidade (ex: Curitiba)"
                                                className="h-9 text-sm"
                                                required
                                            />
                                        </div>
                                        <div className="w-16">
                                            <Input
                                                value={city.state}
                                                maxLength={2}
                                                onChange={(e) =>
                                                    handleCityChange(idx, 'state', e.target.value)
                                                }
                                                placeholder="UF"
                                                className="h-9 text-sm text-center font-mono"
                                                required
                                            />
                                        </div>
                                        <label
                                            className={`flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition-colors ${
                                                city.is_headquarters
                                                    ? 'bg-primary/10 text-primary border border-primary/30'
                                                    : 'text-muted-foreground hover:bg-muted'
                                            }`}
                                            title="Definir esta cidade como Sede da regional"
                                        >
                                            <input
                                                type="radio"
                                                name="is_headquarters_radio"
                                                checked={city.is_headquarters}
                                                onChange={() =>
                                                    handleCityChange(idx, 'is_headquarters', true)
                                                }
                                                className="accent-primary"
                                            />
                                            Sede
                                        </label>
                                        {data.cities.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemoveCity(idx)}
                                                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                                                title="Remover cidade"
                                            >
                                                ✕
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={processing}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar Regional'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
