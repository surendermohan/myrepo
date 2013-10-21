package com.example.attsmstest;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.support.v4.app.NotificationCompat;

import com.google.android.gcm.GCMBaseIntentService;

public class GCMIntentService extends GCMBaseIntentService {

	@Override
	protected void onError(Context arg0, String arg1) {
		// TODO Auto-generated method stub

	}

	@Override
	protected void onMessage(Context context, Intent intent) {
		PendingIntent contentIntent = PendingIntent.getActivity(
			    context, 0, new Intent(context, ToDoActivity.class), 0);


		NotificationCompat.Builder mBuilder =
		        new NotificationCompat.Builder(this)
		            .setSmallIcon(R.drawable.ic_launcher)
		            .setContentTitle("New todo item!")
		            .setContentIntent(contentIntent)
		            .setPriority(Notification.PRIORITY_HIGH)
		            .setContentText(intent.getStringExtra("message"));
			NotificationManager mNotificationManager =
			    (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
			mNotificationManager.notify(0, mBuilder.build());

	}

	@Override
	protected void onRegistered(Context arg0, String arg1) {
		// TODO Auto-generated method stub

	}

	@Override
	protected void onUnregistered(Context arg0, String arg1) {
		// TODO Auto-generated method stub

	}

}
