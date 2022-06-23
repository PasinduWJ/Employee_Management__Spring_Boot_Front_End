import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Employee } from './employee';
import { EmployeeService } from './employee.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  public employees: Employee[] = [];
  public editEmployee: Employee | undefined;
  public deleteEmployee: Employee | undefined; 

  constructor(private employeeService: EmployeeService) { }

  ngOnInit(): void {
    this.getEmployees();
  }

  public getEmployees(): void {
    this.employeeService.getEmployees().subscribe(
      (responce: Employee[]) => {
        this.employees = responce;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public onOpenModal(employee: Employee | null, mode: string): void{
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-bs-toggle', 'modal');
    if(mode === 'add'){
      button.setAttribute('data-bs-target', '#addModal');
    }
    if(mode === 'update'){
      this.editEmployee = employee !== null ? employee : undefined;
      button.setAttribute('data-bs-target', '#updateModal');
    }
    if(mode === 'delete'){
      this.deleteEmployee = employee !== null ? employee : undefined;
      button.setAttribute('data-bs-target', '#deleteModal');
    }

    container?.appendChild(button);
    button.click();
    container?.removeChild(button);

  }

  public onAddEmployee(addForm: NgForm): void{
    document.getElementById('add-employee-close')?.click();
    this.employeeService.addEmployee(addForm.value).subscribe(
      (response: Employee)=>{
        this.getEmployees();
        addForm.reset();
      },
      (error: HttpErrorResponse)=>{
        alert(error.message);
        addForm.reset();
      }
    );
  }

  public onUpdateEmployee(employee: Employee): void{
    document.getElementById('update-employee-close')?.click();
    this.employeeService.updateEmployee(employee).subscribe(
      (response: Employee)=>{
        this.getEmployees();
      },
      (error: HttpErrorResponse)=>{
        alert(error.message);
      }
    );
  }

  public onDeleteEmployee(employeeId: number): void{

    document.getElementById('delete-employee-close')?.click();
    this.employeeService.deleteEmployee(employeeId).subscribe(
      (response: void)=>{
        this.getEmployees();
      },
      (error: HttpErrorResponse)=>{
        alert(error.message);
      }
    );
  }

  public searchEmployees(key: string): void{
    const results: Employee[] = [];
    for (const employee of this.employees){
      if(employee.name.toLowerCase().indexOf(key.toLowerCase()) !== -1 
      || employee.email.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || employee.phone.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || employee.jobTitle.toLowerCase().indexOf(key.toLowerCase()) !== -1){
        results.push(employee);
      }
    }
    this.employees = results;
    if(results.length === 0 || !key){
      this.getEmployees();
    }
  }

}
