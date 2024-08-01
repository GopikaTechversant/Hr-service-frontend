import { AfterViewInit, Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ApiService } from 'src/app/services/api.service';
import Chart, { ChartConfiguration } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-application-list-pie',
  templateUrl: './application-list-pie.component.html',
  styleUrls: ['./application-list-pie.component.css'],
  providers: [DatePipe],
})
export class ApplicationListPieComponent implements OnInit, AfterViewInit {
  @Input() positionId: any;
  @Input() startDate: any;
  @Input() endDate: any;

  chart: any;
  sourceList: any[] = [];
  sourceLabels: any[] = [];
  sourceCount: any[] = [];
  requestId: any;
  today: Date = new Date();

  constructor(private apiService: ApiService, private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.requestId = this.positionId ? this.positionId : '';
    this.fetchResumeSource();
  }

  ngAfterViewInit(): void {
    Chart.register(ChartDataLabels);
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['positionId'] && !changes['positionId'].isFirstChange()) {
      this.requestId = changes['positionId'].currentValue;
      this.fetchResumeSource();
    } else if (changes['startDate'] && !changes['startDate'].isFirstChange()) {
      this.startDate = changes['startDate'].currentValue;
      this.fetchResumeSource();
    } else if (changes['endDate'] && !changes['endDate'].isFirstChange()) {
      this.endDate = changes['endDate'].currentValue;
      this.fetchResumeSource();
    }
  }

  fetchResumeSource(): void {
    this.apiService.get(`/dashboard/resume-source?fromDate=${this.startDate}&toDate=${this.endDate}&requestId=${this.requestId}`).subscribe((res: any) => {
      if (res?.data) {
        this.sourceList = res.data;
        this.sourceCount = this.sourceList.map((item: any) => Number(item?.sourcecount ? item?.sourcecount: '0'));
        this.sourceLabels = this.sourceList.map((item: any) => item.sourceName);
        this.createChart();
        console.log(this.sourceCount);
        
      }
    });
  }

  createChart(): void {
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
          hoverOffset: 5
        }],
      },
      options: {
        responsive: true,
        aspectRatio: 1.9,
        layout: {
          padding: {
            top: 20,
            bottom :30,
            right:10,
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'left',
            align: 'center',
            labels: {
              // usePointStyle: true,
              // pointStyle: 'circle',
            }
          },
          tooltip: {
            enabled: false
          },
          datalabels: {
            display: false,
          },
        },
      },
      plugins: [
        ChartDataLabels, this.doughnutLabelsLinePlugin
      ],
    };

    this.chart = new Chart("MyChart", chartConfig);
  }

  doughnutLabelsLinePlugin = {
    id: 'doughnutLabelsLine',
    afterDraw: (chart: any) => {
      const { ctx, chartArea: { top, bottom, left, right } } = chart;
      const labelPositions: any[] = [];

      chart.data.datasets.forEach((dataset: any, i: any) => {
        chart.getDatasetMeta(i).data.forEach((datapoint: { tooltipPosition: () => { x: any; y: any; }; }, index: number) => {
          const { x, y } = datapoint.tooltipPosition();
          let xLine = right;
          let yLine = y;
          let extraLine = 30;

          switch (index) { 
            case 0://naukri
              xLine = x;
              yLine = bottom - 20;
              extraLine = 70;
              break;
            case 1://linkidin
            xLine = x;
            yLine = bottom + 25;
            extraLine = 90;
              break;
            case 2://indeed
            xLine = x;
            yLine = bottom + 90;
            extraLine = 100;
            if (xLine > top) {
              yLine = top ;
            }
          
              break;
            case 3://candidate 
            xLine = x;
            yLine = bottom - 10;
            extraLine = 120;
            if (xLine > top) {
              yLine = top + 20;
            }
               break;
            case 4://reference
            xLine = x;
            yLine = bottom - 20;
            extraLine = 100;
            if (xLine > top) {
              yLine = top + 60;
            }  break;
            default:
              break;
          }
          let finalYLine = yLine;

          for (const pos of labelPositions) {
            if (Math.abs(finalYLine - pos) < 30) {
              finalYLine += 30 * (yLine > pos ? 1 : -1);
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

          const boxSize = 10;
          ctx.fillStyle = dataset.backgroundColor[index];
          ctx.fillRect(xLine + extraLine, finalYLine - boxSize / 2, boxSize, boxSize);

          ctx.font = '14px Roboto';
          ctx.fontWeight = 'bold';

          const textXPosition = extraLine >= 0 ? 'left' : 'right';
          const plusFivePx = extraLine >= 0 ? 18 : -18;

          ctx.textAlign = textXPosition;
          ctx.textBaseline = 'middle';
          ctx.fillStyle = "#575F6E";

          const label = chart.data.labels[index] + ':';
          const value = chart.data.datasets[0].data[index];

          ctx.fillText(label, xLine + extraLine + boxSize + 10, finalYLine);

          ctx.font = 'bold 16px Roboto';
          // if() ctx.fillText(value, xLine + extraLine + boxSize + 70, finalYLine);
          if(index === 0 || index === 2 || index === 1) ctx.fillText(value, xLine + extraLine + boxSize + 67, finalYLine);
          if(index === 3 || index === 4) ctx.fillText(value, xLine + extraLine + boxSize + 90, finalYLine);
        });
      });
    },
  };
}
