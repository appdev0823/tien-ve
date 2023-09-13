import { Component } from '@angular/core';

@Component({
    selector: 'app-auth-layout',
    templateUrl: './auth-layout.component.html',
    styleUrls: ['./auth-layout.component.scss'],
})
export class AuthLayoutComponent {
    public bgList = [
        { img: 'assets/img/auth-bg-1.png', caption: 'Hãy bắt đầu quản lý dòng tiền của bạn thông minh hơn.' },
        { img: 'assets/img/auth-bg-2.png', caption: 'Dễ dàng quản lý tài khoản ngân hàng và dòng tiền. ' },
        { img: 'assets/img/auth-bg-3.png', caption: 'Tự động gửi thông báo đóng tiền và cập nhất tiền công nợ liên tục. ' },
        { img: 'assets/img/auth-bg-4.png', caption: 'Quản lý các danh sách công nợ và tiền thu hàng tháng' },
    ];
}
