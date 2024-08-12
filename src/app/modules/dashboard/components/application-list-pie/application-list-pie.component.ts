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
  sourceList: any[] = [
    { sourceId: 1, sourceName: 'Naukri', sourcecount: '206' },
    { sourceId: 2, sourceName: 'Linkedin', sourcecount: '396' },
    { sourceId: 3, sourceName: 'Indeed', sourcecount: '99' },
    { sourceId: 4, sourceName: 'Candidate', sourcecount: '41' },
    { sourceId: 5, sourceName: 'Reference', sourcecount: '11' },
  ];
  sourceLabels: string[] = [];
  sourceCount: number[] = [];
  requestId: any;
  today: Date = new Date();

  constructor(private apiService: ApiService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.requestId = this.positionId ? this.positionId : '';
    this.setSourceData();
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

  setSourceData(): void {
    this.sourceLabels = this.sourceList.map((item: any) => item.sourceName);
    this.sourceCount = this.sourceList.map((item: any) => Number(item.sourcecount));
  }

  fetchResumeSource(): void {
    this.apiService.get(`/dashboard/resume-source?fromDate=${this.startDate}&toDate=${this.endDate}&requestId=${this.requestId}`).subscribe((res: any) => {
      if (res?.data) {
        this.sourceList = res.data;
        this.setSourceData();
        this.createChart();
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
          backgroundColor: ['#628AFC', '#1790C5', '#005EC9', '#047892', '#3EB2B8'],
          borderColor: ['#628AFC', '#1790C5', '#005EC9', '#047892', '#3EB2B8'],
          fill: false,
          hoverOffset: 5
        }],
      },
      options: {
        responsive: true,
        aspectRatio: 1.9,
        layout: {
          padding: {
            top: 20,
            bottom: 30,
            right: 10,
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'left',
            align: 'center',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
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
                yLine = top;
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
              } break;
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
          if(this.sourceLabels?.length === 1) {
            ctx.fillText(value, xLine + extraLine + boxSize + 77, finalYLine);
          }else{
            if (index === 0 || index === 2 || index === 1) ctx.fillText(value, xLine + extraLine + boxSize + 67, finalYLine);
            if (index === 3 || index === 4) ctx.fillText(value, xLine + extraLine + boxSize + 90, finalYLine);
          }  
        });
      });
    },
  };

  // doughnutLabelsLinePlugin = {
  //   id: 'doughnutLabelsLine',
  //   afterDraw: (chart: any) => {
  //     const { ctx, chartArea: { top, bottom, left, right } } = chart;
  //     const centerX = (left + right) / 2;
  //     const centerY = (top + bottom) / 2;
  //     const radius = (Math.min(right - left, bottom - top) / 2) * 0.9;

  //     chart.data.datasets.forEach((dataset: any, i: any) => {
  //       chart.getDatasetMeta(i).data.forEach((datapoint: { tooltipPosition: () => { x: any; y: any; }; }, index: number) => {
  //         const { x, y } = datapoint.tooltipPosition();
  //         const angle = Math.atan2(y - centerY, x - centerX);
  //         const xLine = centerX + Math.cos(angle) * (radius + 30);
  //         const yLine = centerY + Math.sin(angle) * (radius + 30);
  //         const extraLine = 30 * Math.sign(Math.cos(angle));

  //         ctx.beginPath();
  //         ctx.moveTo(x, y);
  //         ctx.arc(x, y, 2, 0, 2 * Math.PI, true);
  //         ctx.fill();
  //         ctx.moveTo(x, y);
  //         ctx.lineTo(xLine, yLine);
  //         ctx.lineTo(xLine + extraLine, yLine);
  //         ctx.strokeStyle = "black";
  //         ctx.stroke();

  //         const boxSize = 10;
  //         ctx.fillStyle = dataset.backgroundColor[index];
  //         ctx.fillRect(xLine + extraLine, yLine - boxSize / 2, boxSize, boxSize);

  //         ctx.font = '14px Roboto';
  //         ctx.fontWeight = 'bold';

  //         const textXPosition = extraLine >= 0 ? 'left' : 'right';

  //         ctx.textAlign = textXPosition;
  //         ctx.textBaseline = 'middle';
  //         ctx.fillStyle = "#575F6E";

  //         const label = chart.data.labels[index] + ':';
  //         const value = chart.data.datasets[0].data[index];

  //         ctx.save();
  //         ctx.translate(xLine + extraLine + boxSize + 10, yLine);
  //         ctx.rotate(angle);
  //         ctx.fillText(label, 0, 0);
  //         ctx.restore();

  //         ctx.save();
  //         ctx.translate(xLine + extraLine + boxSize + 30, yLine);
  //         ctx.rotate(angle);
  //         ctx.font = 'bold 16px Roboto';
  //         ctx.fillText(value.toString(), 0, 0);
  //         ctx.restore();
  //       });
  //     });
  //   },
  // };



}
