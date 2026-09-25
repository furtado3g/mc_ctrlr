<?php

namespace App\Reports;

use Symfony\Component\HttpFoundation\StreamedResponse;

class CsvExporter
{
    /**
     * @param  list<array<string, mixed>>  $rows
     * @param  array<string, int>  $totals
     */
    public function download(string $name, array $rows, string $start, string $end, array $totals = []): StreamedResponse
    {
        return response()->streamDownload(function () use ($rows, $start, $end, $totals) {
            $handle = fopen('php://output', 'w');
            if ($handle === false) {
                throw new \RuntimeException('Não foi possível abrir a saída CSV.');
            }
            fwrite($handle, "\xEF\xBB\xBF");
            fputcsv($handle, ['Período inicial', $start]);
            fputcsv($handle, ['Período final', $end]);
            fputcsv($handle, ['Gerado em', now()->toIso8601String()]);
            if ($rows) {
                fputcsv($handle, array_keys($rows[0]));
                foreach ($rows as $row) {
                    fputcsv($handle, $row);
                }
            } else {
                fputcsv($handle, ['Nenhum registro no período']);
            }
            foreach ($totals as $label => $value) {
                fputcsv($handle, ['Total '.$label, $value]);
            }
            fclose($handle);
        }, $name.'.csv', ['Content-Type' => 'text/csv; charset=UTF-8']);
    }
}
