{{/*
Expand the name of the chart.
*/}}
{{- define "ChartName" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}
