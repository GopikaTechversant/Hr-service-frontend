import { AfterViewInit, Component, Input, OnInit, SimpleChanges } from '@angular/core';
import Chart, { ChartConfiguration } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { DatePipe } from '@angular/common';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-application-list-pie',
  templateUrl: './application-list-pie.component.html',
  styleUrls: ['./application-list-pie.component.css'],
  providers: [DatePipe],
})
export class ApplicationListPieComponent implements OnInit, AfterViewInit {
  @Input() positionId: any;
  chart: any;
  sourceList: any[] = [];
  sourceLabels: any[] = [];
  sourceCount: any[] = [];
  requestId: any;
  today: Date = new Date();
  startDate: string | null = this.datePipe.transform(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
  endDate: string | null = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

  constructor(private apiService: ApiService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.requestId = this.positionId ? this.positionId : '';
    this.fetchResumeSource();
  }

  ngAfterViewInit(): void {
    Chart.register(ChartDataLabels);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['positionId'] && !changes['positionId'].isFirstChange()) {
      this.requestId = changes['positionId'].currentValue;
      this.fetchResumeSource();
    }
  }

  fetchResumeSource(): void {
    this.apiService.get(`/dashboard/resume-source?fromDate=${this.startDate}&toDate=${this.endDate}&requestId=${this.requestId}`).subscribe((res: any) => {
      if (res?.data) {
        this.sourceList = res?.data;
        this.sourceCount = this.sourceList.map((item: any) => Number(item.sourcecount));
        this.sourceLabels = this.sourceList.map((item: any) => item.sourceName);
        this.createChart();
      }
    });
  }

  dateChange(event: any, range: string): void {
    let date = new Date(event?.value);
    if (range == 'startDate') this.startDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    if (range == 'endDate') this.endDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    this.positionId = '';
    this.fetchResumeSource();
  }

  createChart() {
    if (this.chart) {
      this.chart.destroy();
    }

    const chartConfig: ChartConfiguration = {
      type: 'doughnut',
      data: {
        labels: this.sourceLabels,
        datasets: [{
          data: this.sourceCount,
          backgroundColor: ['#628afc', '#005ec9', '#047892', '#224462', '#0094d4'],
          borderColor: ['#628afc', '#005ec9', '#047892', '#224462', '#0094d4'],
          fill: false,
          barThickness: 30,  
        }],
      },
      options: {
        responsive: true,
        aspectRatio: 1.6,
        // cutout: '70%', // Adjust this value to change the thickness
        layout: {
          padding: 30,
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false
          },
          datalabels: {
            display: false
          }
        },
      },
      plugins: [this.doughnutLabelsLinePlugin, ChartDataLabels],
    };

    this.chart = new Chart("MyChart", chartConfig);
  }

  doughnutLabelsLinePlugin = {
    id: 'doughnutLabelsLine',
    afterDraw(chart: any, args: any, option: any) {
      const { ctx, chartArea: { top, bottom, left, right, width, height }, } = chart;
      const labelPositions: any[] = [];
      chart.data.datasets.forEach((dataset: any, i: any) => {
        chart.getDatasetMeta(i).data.forEach((datapoint: { tooltipPosition: () => { x: any; y: any; }; }, index: string | number) => {
          const { x, y } = datapoint.tooltipPosition();
          const halfwidth = width / 2;
          const halfheight = height / 2;
          const xLine = x >= halfwidth ? x + 45 : x - 45;
          const yLine = y >= halfheight ? y + 45 : y - 45;
          const extraLine = x >= halfwidth ? 20 : -20;
          let finalYLine = yLine;
          for (const pos of labelPositions) {
            if (Math.abs(finalYLine - pos) < 20) {
              finalYLine += 20 * (yLine > pos ? 1 : -1);
            }
          }
          labelPositions.push(finalYLine);

          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.arc(x, y, 2, 0, 2 * Math.PI, true);
          ctx.fill();
          ctx.moveTo(x, y);
          ctx.lineTo(xLine, finalYLine);
          ctx.lineTo(xLine + extraLine, finalYLine);
          ctx.strokeStyle = "black";
          ctx.stroke();

          ctx.font = '14px Roboto';
          ctx.fontWeight = 'bold';
          const textXPosition = x ? x >= halfwidth ? 'left' : 'right' : y >= halfheight ? 'top' : 'bottom';
          const plusFivePx = x >= halfwidth ? 5 : -5;

          ctx.textAlign = textXPosition;
          ctx.textBaseline = 'middle';
          ctx.fillStyle = dataset.borderColor[index];

          ctx.fillText(((chart.data.labels[index]) + ' ' + (chart.data.datasets[0].data[index])), xLine + extraLine + plusFivePx, finalYLine);
        });
      });
    },
  };
}
