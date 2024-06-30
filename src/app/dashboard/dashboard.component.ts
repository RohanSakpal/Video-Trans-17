import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GcpDataService } from '../services/gcp-data.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  constructor(private router: Router,private gcpDataService: GcpDataService) { }
  videoArr: any[] = [];
  keyword:string = '';
  isDataNotFound:boolean = false;
  ngOnInit(): void {
    if(sessionStorage.getItem('keyword') !== null) {
      this.keyword = sessionStorage.getItem('keyword') || '{}';
      this.onSearch();
    }
  }

  visitPlayer(id:string) {
    this.router.navigate([`/videoplayer/${id}`]);
  }

  keyupFunc() {
    this.isDataNotFound = false;
  }

  onSearch() {
    if(this.keyword != '') {
      sessionStorage.setItem('keyword',this.keyword);
      this.gcpDataService.getGcpData(this.keyword).subscribe(data => {
        this.videoArr = data;
        if(this.videoArr.length == 0) {
          this.isDataNotFound = true;
        }
      });
    }
  }

}
